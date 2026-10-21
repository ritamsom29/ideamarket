'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { ConnectionStatus, NotificationType } from '@prisma/client'

export async function sendConnectionRequest(receiverId: string, message?: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  const senderId = session.user.id
  if (senderId === receiverId) {
    return { success: false, error: 'You cannot connect with yourself.' }
  }

  try {
    // Check if reverse request exists
    const reverse = await prisma.connectionRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: receiverId,
          receiverId: senderId,
        },
      },
    })

    if (reverse) {
      if (reverse.status === ConnectionStatus.PENDING) {
        // Auto-accept reciprocal request
        await prisma.connectionRequest.update({
          where: { id: reverse.id },
          data: { status: ConnectionStatus.ACCEPTED, respondedAt: new Date() },
        })
        revalidatePath('/connections')
        return { success: true, message: 'Mutual connection confirmed!' }
      } else if (reverse.status === ConnectionStatus.ACCEPTED) {
        return { success: false, error: 'You are already connected.' }
      }
    }

    const existing = await prisma.connectionRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
    })

    if (existing) {
      if (existing.status === ConnectionStatus.PENDING) {
        return { success: false, error: 'A pending request has already been sent.' }
      } else if (existing.status === ConnectionStatus.ACCEPTED) {
        return { success: false, error: 'You are already connected.' }
      } else {
        // Re-request after decline or cancel
        await prisma.connectionRequest.update({
          where: { id: existing.id },
          data: {
            status: ConnectionStatus.PENDING,
            message: message || null,
            respondedAt: null,
          },
        })
      }
    } else {
      await prisma.connectionRequest.create({
        data: {
          senderId,
          receiverId,
          status: ConnectionStatus.PENDING,
          message: message || null,
        },
      })
    }

    // Generate notification
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: NotificationType.CONNECTION_REQUEST,
        title: 'New Connection Request',
        message: `${session.user.name || 'Someone'} sent you a connection request.`,
        linkUrl: '/connections',
      },
    })

    revalidatePath('/connections')
    return { success: true, message: 'Connection request sent successfully.' }
  } catch (error) {
    console.error('Connection request error:', error)
    return { success: false, error: 'Failed to send connection request.' }
  }
}

export async function respondToConnectionRequest(
  requestId: string,
  action: 'ACCEPTED' | 'DECLINED'
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized.' }
  }

  try {
    const request = await prisma.connectionRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: { select: { id: true, name: true } },
      },
    })

    if (!request || (request.receiverId !== session.user.id && session.user.role !== 'ADMIN')) {
      return { success: false, error: 'Forbidden. You are not the recipient of this request.' }
    }

    const newStatus =
      action === 'ACCEPTED' ? ConnectionStatus.ACCEPTED : ConnectionStatus.DECLINED

    await prisma.connectionRequest.update({
      where: { id: requestId },
      data: {
        status: newStatus,
        respondedAt: new Date(),
      },
    })

    // Notify original sender
    await prisma.notification.create({
      data: {
        userId: request.senderId,
        type:
          action === 'ACCEPTED'
            ? NotificationType.CONNECTION_ACCEPTED
            : NotificationType.CONNECTION_DECLINED,
        title: `Connection Request ${action === 'ACCEPTED' ? 'Accepted' : 'Declined'}`,
        message: `${session.user.name || 'A user'} has ${action.toLowerCase()} your connection request.`,
        linkUrl: '/connections',
      },
    })

    revalidatePath('/connections')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to respond to connection request.' }
  }
}

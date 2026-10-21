'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { NotificationType } from '@prisma/client'

export async function sendMessage(conversationId: string, content: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please sign in.' }
  }

  const trimmed = content.trim()
  if (!trimmed) {
    return { success: false, error: 'Message cannot be empty.' }
  }

  try {
    // Verify user is a participant of this conversation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id,
        },
      },
    })

    if (!participant && session.user.role !== 'ADMIN') {
      return { success: false, error: 'Forbidden. You are not a participant in this conversation.' }
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content: trimmed,
      },
    })

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    // Notify other participants
    const otherParticipants = await prisma.conversationParticipant.findMany({
      where: {
        conversationId,
        userId: { not: session.user.id },
      },
    })

    for (const p of otherParticipants) {
      await prisma.notification.create({
        data: {
          userId: p.userId,
          type: NotificationType.NEW_MESSAGE,
          title: `New message from ${session.user.name || 'a user'}`,
          message: trimmed.length > 80 ? trimmed.substring(0, 80) + '...' : trimmed,
          linkUrl: `/messages?id=${conversationId}`,
        },
      })
    }

    revalidatePath(`/messages?id=${conversationId}`)
    return {
      success: true,
      message: {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        createdAt: message.createdAt.toISOString(),
      },
    }
  } catch (error) {
    console.error('Send message error:', error)
    return { success: false, error: 'Failed to send message.' }
  }
}

export async function startConversation(recipientUserId: string, initialMessage: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized.' }
  }

  const senderId = session.user.id
  if (senderId === recipientUserId) {
    return { success: false, error: 'Cannot start conversation with yourself.' }
  }

  try {
    // Check if conversation already exists between both users
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: senderId } } },
          { participants: { some: { userId: recipientUserId } } },
        ],
      },
    })

    if (existing) {
      if (initialMessage.trim()) {
        await sendMessage(existing.id, initialMessage)
      }
      return { success: true, conversationId: existing.id }
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [{ userId: senderId }, { userId: recipientUserId }],
        },
      },
    })

    if (initialMessage.trim()) {
      await sendMessage(conversation.id, initialMessage)
    }

    revalidatePath('/messages')
    return { success: true, conversationId: conversation.id }
  } catch (error) {
    console.error('Start conversation error:', error)
    return { success: false, error: 'Failed to create conversation.' }
  }
}

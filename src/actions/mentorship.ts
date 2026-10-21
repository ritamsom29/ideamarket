'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { MentorshipStatus, NotificationType } from '@prisma/client'

export async function requestMentorship(mentorUserId: string, goals: string, message: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  const senderId = session.user.id
  if (senderId === mentorUserId) {
    return { success: false, error: 'You cannot request mentorship from yourself.' }
  }

  try {
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: mentorUserId },
    })

    if (!mentorProfile || !mentorProfile.isAvailable) {
      return { success: false, error: 'This mentor is currently not accepting new mentees.' }
    }

    // Check existing
    const existing = await prisma.mentorshipRequest.findFirst({
      where: {
        senderId,
        mentorId: mentorUserId,
        status: { in: [MentorshipStatus.PENDING, MentorshipStatus.ACCEPTED] },
      },
    })

    if (existing) {
      return { success: false, error: 'You already have an active mentorship engagement or pending request with this mentor.' }
    }

    await prisma.mentorshipRequest.create({
      data: {
        senderId,
        mentorId: mentorUserId,
        mentorProfileId: mentorProfile.id,
        status: MentorshipStatus.PENDING,
        goals,
        message,
      },
    })

    // Notify mentor
    await prisma.notification.create({
      data: {
        userId: mentorUserId,
        type: NotificationType.MENTORSHIP_REQUEST,
        title: 'New Mentorship Request',
        message: `${session.user.name || 'An entrepreneur'} requested mentorship guidance from you.`,
        linkUrl: '/dashboard/mentorship-requests',
      },
    })

    revalidatePath('/dashboard/mentorship')
    return { success: true, message: 'Mentorship request submitted successfully!' }
  } catch (error) {
    console.error('Mentorship request error:', error)
    return { success: false, error: 'Failed to submit mentorship request.' }
  }
}

export async function respondToMentorshipRequest(
  requestId: string,
  action: 'ACCEPTED' | 'DECLINED' | 'COMPLETED',
  responseMessage?: string
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized.' }
  }

  try {
    const request = await prisma.mentorshipRequest.findUnique({
      where: { id: requestId },
    })

    if (!request || (request.mentorId !== session.user.id && session.user.role !== 'ADMIN')) {
      return { success: false, error: 'Forbidden. You are not authorized to respond to this request.' }
    }

    let status: MentorshipStatus = MentorshipStatus.DECLINED
    if (action === 'ACCEPTED') status = MentorshipStatus.ACCEPTED
    if (action === 'COMPLETED') status = MentorshipStatus.COMPLETED

    await prisma.mentorshipRequest.update({
      where: { id: requestId },
      data: {
        status,
        responseMessage,
        respondedAt: new Date(),
        completedAt: action === 'COMPLETED' ? new Date() : undefined,
      },
    })

    // Notify entrepreneur
    await prisma.notification.create({
      data: {
        userId: request.senderId,
        type:
          action === 'ACCEPTED'
            ? NotificationType.MENTORSHIP_ACCEPTED
            : action === 'COMPLETED'
            ? NotificationType.MENTORSHIP_COMPLETED
            : NotificationType.MENTORSHIP_DECLINED,
        title: `Mentorship Request ${action === 'ACCEPTED' ? 'Accepted' : action === 'COMPLETED' ? 'Completed' : 'Declined'}`,
        message: `Your mentor has ${action.toLowerCase()} the mentorship engagement.`,
        linkUrl: '/dashboard/mentorship',
      },
    })

    revalidatePath('/dashboard/mentorship-requests')
    revalidatePath('/dashboard/mentorship')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update mentorship status.' }
  }
}

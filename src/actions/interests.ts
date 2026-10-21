'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { InvestmentInterestStatus, NotificationType } from '@prisma/client'

export async function expressInvestmentInterest(startupId: string, message: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Please log in to express interest.' }
  }

  if (session.user.role !== 'INVESTOR' && session.user.role !== 'ADMIN') {
    return { success: false, error: 'Only registered investors can express interest.' }
  }

  try {
    const investorProfile = await prisma.investorProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!investorProfile) {
      return { success: false, error: 'Please complete your investor profile first.' }
    }

    const startup = await prisma.startup.findUnique({
      where: { id: startupId },
      select: { id: true, userId: true, name: true },
    })

    if (!startup) {
      return { success: false, error: 'Startup not found.' }
    }

    // Check if interest already exists
    const existing = await prisma.investmentInterest.findUnique({
      where: {
        investorUserId_startupId: {
          investorUserId: session.user.id,
          startupId,
        },
      },
    })

    if (existing) {
      if (existing.status === InvestmentInterestStatus.WITHDRAWN) {
        // Re-open
        await prisma.investmentInterest.update({
          where: { id: existing.id },
          data: {
            status: InvestmentInterestStatus.PENDING,
            message,
            respondedAt: null,
            responseMessage: null,
          },
        })
      } else {
        return { success: false, error: 'You have already expressed interest in this startup.' }
      }
    } else {
      await prisma.investmentInterest.create({
        data: {
          investorUserId: session.user.id,
          investorProfileId: investorProfile.id,
          startupId,
          status: InvestmentInterestStatus.PENDING,
          message,
        },
      })
    }

    // Notify founder
    await prisma.notification.create({
      data: {
        userId: startup.userId,
        type: NotificationType.INVESTMENT_INTEREST,
        title: 'New Investment Interest Expressed',
        message: `${session.user.name || 'An investor'} expressed investment interest in ${startup.name}.`,
        linkUrl: '/dashboard/interests',
      },
    })

    revalidatePath('/dashboard/interests')
    revalidatePath(`/startups/${startupId}`)
    return { success: true, message: 'Investment interest submitted successfully.' }
  } catch (error) {
    console.error('Express interest error:', error)
    return { success: false, error: 'Failed to record investment interest.' }
  }
}

export async function respondToInvestmentInterest(
  interestId: string,
  action: 'ACCEPTED' | 'DECLINED',
  responseMessage?: string
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized.' }
  }

  try {
    const interest = await prisma.investmentInterest.findUnique({
      where: { id: interestId },
      include: {
        startup: { select: { userId: true, name: true } },
      },
    })

    if (!interest) {
      return { success: false, error: 'Interest record not found.' }
    }

    // Verify current user owns the startup
    if (interest.startup.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return { success: false, error: 'Forbidden. You do not own this startup listing.' }
    }

    const newStatus =
      action === 'ACCEPTED'
        ? InvestmentInterestStatus.ACCEPTED
        : InvestmentInterestStatus.DECLINED

    await prisma.investmentInterest.update({
      where: { id: interestId },
      data: {
        status: newStatus,
        responseMessage,
        respondedAt: new Date(),
      },
    })

    // If accepted, also auto-create a mutual connection if one doesn't exist
    if (action === 'ACCEPTED') {
      await prisma.connectionRequest.upsert({
        where: {
          senderId_receiverId: {
            senderId: interest.investorUserId,
            receiverId: session.user.id,
          },
        },
        create: {
          senderId: interest.investorUserId,
          receiverId: session.user.id,
          status: 'ACCEPTED',
          message: 'Connection established via mutual investment interest.',
          respondedAt: new Date(),
        },
        update: {
          status: 'ACCEPTED',
          respondedAt: new Date(),
        },
      })
    }

    // Notify investor
    await prisma.notification.create({
      data: {
        userId: interest.investorUserId,
        type:
          action === 'ACCEPTED'
            ? NotificationType.INVESTMENT_ACCEPTED
            : NotificationType.INVESTMENT_DECLINED,
        title: `Investment Interest ${action === 'ACCEPTED' ? 'Accepted' : 'Declined'}`,
        message: `The founder of ${interest.startup.name} has ${action.toLowerCase()} your investment interest.`,
        linkUrl: '/dashboard/interests',
      },
    })

    revalidatePath('/dashboard/interests')
    return { success: true }
  } catch (error) {
    console.error('Response error:', error)
    return { success: false, error: 'Failed to update interest status.' }
  }
}

export async function withdrawInvestmentInterest(interestId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized.' }
  }

  try {
    const interest = await prisma.investmentInterest.findUnique({
      where: { id: interestId },
    })

    if (!interest || (interest.investorUserId !== session.user.id && session.user.role !== 'ADMIN')) {
      return { success: false, error: 'Forbidden. You did not submit this interest.' }
    }

    await prisma.investmentInterest.update({
      where: { id: interestId },
      data: {
        status: InvestmentInterestStatus.WITHDRAWN,
      },
    })

    revalidatePath('/dashboard/interests')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to withdraw interest.' }
  }
}

export async function toggleSaveStartup(startupId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Please log in to save startups.' }
  }

  try {
    const existing = await prisma.savedStartup.findUnique({
      where: {
        userId_startupId: {
          userId: session.user.id,
          startupId,
        },
      },
    })

    if (existing) {
      await prisma.savedStartup.delete({
        where: {
          userId_startupId: {
            userId: session.user.id,
            startupId,
          },
        },
      })
      revalidatePath('/dashboard/saved')
      return { success: true, saved: false }
    } else {
      await prisma.savedStartup.create({
        data: {
          userId: session.user.id,
          startupId,
        },
      })
      revalidatePath('/dashboard/saved')
      return { success: true, saved: true }
    }
  } catch (error) {
    return { success: false, error: 'Failed to update watchlist.' }
  }
}

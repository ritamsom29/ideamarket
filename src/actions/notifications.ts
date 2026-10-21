'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function markNotificationAsRead(id: string) {
  const session = await auth()
  if (!session?.user?.id) return { success: false }

  try {
    await prisma.notification.updateMany({
      where: { id, userId: session.user.id },
      data: { status: 'READ' },
    })
    revalidatePath('/notifications')
    return { success: true }
  } catch {
    return { success: false }
  }
}

export async function markAllNotificationsAsRead() {
  const session = await auth()
  if (!session?.user?.id) return { success: false }

  try {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, status: 'UNREAD' },
      data: { status: 'READ' },
    })
    revalidatePath('/notifications')
    return { success: true }
  } catch {
    return { success: false }
  }
}

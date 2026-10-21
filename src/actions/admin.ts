'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { AuditAction, StartupStatus, UserRole } from '@prisma/client'

async function verifyAdmin() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Forbidden: Administrative privileges required')
  }
  return session.user
}

export async function toggleUserStatus(userId: string, shouldSuspend: boolean, reason: string) {
  try {
    const admin = await verifyAdmin()

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !shouldSuspend },
    })

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: shouldSuspend ? AuditAction.USER_SUSPENDED : AuditAction.USER_REACTIVATED,
        targetType: 'User',
        targetId: userId,
        description: `${shouldSuspend ? 'Suspended' : 'Reactivated'} user ${user.email}. Reason: ${reason}`,
      },
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function moderateStartup(
  startupId: string,
  action: 'APPROVE' | 'SUSPEND',
  notes: string
) {
  try {
    const admin = await verifyAdmin()

    const status = action === 'APPROVE' ? StartupStatus.PUBLISHED : StartupStatus.SUSPENDED
    const startup = await prisma.startup.update({
      where: { id: startupId },
      data: {
        status,
        publishedAt: action === 'APPROVE' ? new Date() : undefined,
      },
    })

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: action === 'APPROVE' ? AuditAction.STARTUP_APPROVED : AuditAction.STARTUP_SUSPENDED,
        targetType: 'Startup',
        targetId: startupId,
        description: `Admin ${action.toLowerCase()}d startup ${startup.name}. Notes: ${notes}`,
      },
    })

    revalidatePath('/admin/startups')
    revalidatePath('/startups')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

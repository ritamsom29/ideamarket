import Link from 'next/link'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/actions/notifications'
import {
  Bell,
  CheckCheck,
  TrendingUp,
  MessageSquare,
  Users,
  GraduationCap,
  Sparkles,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  const session = await auth()
  const userId = session?.user?.id!

  let notifications: any[] = []
  try {
    notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.warn('DB error fetching notifications:', error)
  }

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length

  const getIcon = (type: string) => {
    switch (type) {
      case 'INVESTMENT_INTEREST':
      case 'INVESTMENT_ACCEPTED':
      case 'INVESTMENT_DECLINED':
        return <TrendingUp className="h-5 w-5 text-teal-600" />
      case 'NEW_MESSAGE':
        return <MessageSquare className="h-5 w-5 text-blue-600" />
      case 'CONNECTION_REQUEST':
      case 'CONNECTION_ACCEPTED':
        return <Users className="h-5 w-5 text-indigo-600" />
      case 'MENTORSHIP_REQUEST':
      case 'MENTORSHIP_ACCEPTED':
        return <GraduationCap className="h-5 w-5 text-emerald-600" />
      default:
        return <Bell className="h-5 w-5 text-slate-500" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time activity alerts regarding your venture proposals, connections, and discussions.
          </p>
        </div>

        {unreadCount > 0 && (
          <form action={async () => {
            'use server'
            await markAllNotificationsAsRead()
          }}>
            <Button size="sm" variant="outline" type="submit" className="text-xs gap-1.5">
              <CheckCheck className="h-3.5 w-3.5" /> Mark all as read ({unreadCount})
            </Button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-slate-200">
          <Bell className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-slate-800">No Notifications</h3>
          <p className="text-xs text-slate-500 mt-1">
            You are all caught up! New inquiries and messages will trigger alerts here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif: any) => {
            const isUnread = notif.status === 'UNREAD'
            return (
              <Card
                key={notif.id}
                className={`p-4 transition-all duration-200 ${
                  isUnread
                    ? 'bg-blue-50/40 border-blue-200/80 shadow-xs'
                    : 'bg-white border-slate-200/80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-xs shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                        {isUnread && (
                          <span className="h-2 w-2 rounded-full bg-teal-500" title="Unread" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-slate-400">
                        {formatRelativeTime(notif.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {notif.linkUrl && (
                      <Button size="sm" variant="ghost" asChild className="text-xs text-[#1e3a5f]">
                        <Link href={notif.linkUrl}>View</Link>
                      </Button>
                    )}

                    {isUnread && (
                      <form action={async () => {
                        'use server'
                        await markNotificationAsRead(notif.id)
                      }}>
                        <Button size="sm" variant="ghost" type="submit" className="text-xs text-slate-400 hover:text-slate-700">
                          Mark read
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

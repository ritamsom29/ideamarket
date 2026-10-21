import Link from 'next/link'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials, formatDate } from '@/lib/utils'
import { respondToConnectionRequest } from '@/actions/connections'
import { Users, UserCheck, Check, X, MessageSquare, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ConnectionsPage() {
  const session = await auth()
  const userId = session?.user?.id!

  let pendingIncoming: any[] = []
  let pendingOutgoing: any[] = []
  let activeConnections: any[] = []

  try {
    const [incoming, outgoing, connected] = await Promise.all([
      // Pending requests received
      prisma.connectionRequest.findMany({
        where: { receiverId: userId, status: 'PENDING' },
        include: { sender: true },
        orderBy: { createdAt: 'desc' },
      }),
      // Pending requests sent
      prisma.connectionRequest.findMany({
        where: { senderId: userId, status: 'PENDING' },
        include: { receiver: true },
        orderBy: { createdAt: 'desc' },
      }),
      // Accepted connections
      prisma.connectionRequest.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
          status: 'ACCEPTED',
        },
        include: { sender: true, receiver: true },
        orderBy: { updatedAt: 'desc' },
      }),
    ])

    pendingIncoming = incoming
    pendingOutgoing = outgoing
    activeConnections = connected.map(c => {
      const partner = c.senderId === userId ? c.receiver : c.sender
      return {
        id: c.id,
        partner,
        connectedAt: c.respondedAt || c.updatedAt,
      }
    })
  } catch (error) {
    console.warn('DB error fetching connections:', error)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
          Network & Connections
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your verified founder, investor, and mentor professional connections.
        </p>
      </div>

      {/* PENDING INCOMING REQUESTS */}
      {pendingIncoming.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            Pending Invitations ({pendingIncoming.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingIncoming.map((req: any) => (
              <Card key={req.id} className="p-4 bg-white border border-amber-200/80 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={req.sender.image || ''} alt={req.sender.name || ''} />
                      <AvatarFallback className="bg-[#1e3a5f] text-white text-xs">
                        {getInitials(req.sender.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{req.sender.name}</h4>
                      <p className="text-xs text-teal-700 capitalize">{req.sender.role.toLowerCase()}</p>
                      {req.message && (
                        <p className="text-xs text-slate-500 mt-1 italic">"{req.message}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <form action={async () => {
                      'use server'
                      await respondToConnectionRequest(req.id, 'ACCEPTED')
                    }}>
                      <Button size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-2.5">
                        <Check className="h-3.5 w-3.5 mr-1" /> Accept
                      </Button>
                    </form>
                    <form action={async () => {
                      'use server'
                      await respondToConnectionRequest(req.id, 'DECLINED')
                    }}>
                      <Button size="sm" variant="ghost" type="submit" className="text-red-600 h-8 px-2">
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE CONNECTIONS LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-teal-600" />
          Active Connections ({activeConnections.length})
        </h2>

        {activeConnections.length === 0 ? (
          <Card className="p-12 text-center bg-white border border-slate-200">
            <Users className="h-10 w-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-slate-800">No Active Connections Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-6">
              Connect with founders in startup discovery or accredited investors to build your venture network.
            </p>
            <div className="flex justify-center gap-3">
              <Button asChild size="sm" className="bg-[#1e3a5f] text-white">
                <Link href="/investors">Find Investors</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/mentors">Find Mentors</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeConnections.map((item: any) => (
              <Card key={item.id} className="p-5 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12 border border-slate-200">
                    <AvatarImage src={item.partner.image || ''} alt={item.partner.name || ''} />
                    <AvatarFallback className="bg-[#1e3a5f] text-white text-sm">
                      {getInitials(item.partner.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.partner.name}</h3>
                    <p className="text-xs text-teal-700 font-medium capitalize">
                      {item.partner.role.toLowerCase()}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Connected {formatDate(item.connectedAt)}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                    {item.partner.email}
                  </span>
                  <Button size="sm" variant="outline" asChild className="text-xs gap-1.5">
                    <Link href={`/messages`}>
                      <MessageSquare className="h-3.5 w-3.5" /> Message
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* PENDING SENT REQUESTS */}
      {pendingOutgoing.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-sm font-bold text-slate-700">Sent Invitations Awaiting Approval ({pendingOutgoing.length})</h2>
          <div className="space-y-2">
            {pendingOutgoing.map((req: any) => (
              <div key={req.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                <span>Sent request to <strong>{req.receiver.name}</strong> ({req.receiver.email})</span>
                <Badge variant="outline" className="text-[10px]">Pending</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

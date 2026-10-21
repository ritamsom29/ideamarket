import Link from 'next/link'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { respondToMentorshipRequest } from '@/actions/mentorship'
import { GraduationCap, CheckCircle, XCircle, CheckSquare, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MentorRequestsPage() {
  const session = await auth()
  const userId = session?.user?.id!

  let requests: any[] = []
  try {
    requests = await prisma.mentorshipRequest.findMany({
      where: { mentorId: userId },
      include: {
        sender: {
          include: {
            entrepreneurProfile: true,
            startups: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.warn('DB error fetching mentor requests:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
          Inbound Mentorship Requests
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review goals, advisory needs, and milestones from founders requesting your operator mentorship.
        </p>
      </div>

      {requests.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-slate-200">
          <GraduationCap className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-slate-800">No Mentorship Requests</h3>
          <p className="text-xs text-slate-500 mt-1">
            When entrepreneurs submit mentorship requests through your public profile, they will be listed here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req: any) => (
            <Card key={req.id} className="p-6 bg-white border border-slate-200 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-lg">{req.sender.name}</h3>
                    <Badge
                      variant={
                        req.status === 'ACCEPTED'
                          ? 'default'
                          : req.status === 'PENDING'
                          ? 'secondary'
                          : req.status === 'COMPLETED'
                          ? 'outline'
                          : 'destructive'
                      }
                      className="text-[10px]"
                    >
                      {req.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500">
                    Location: <strong>{req.sender.entrepreneurProfile?.location || 'India'}</strong> • Past Startups: <strong>{req.sender.entrepreneurProfile?.previousStartups || 0}</strong>
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-2 mt-2">
                    <p>
                      <strong className="text-slate-900 block mb-0.5">Guidance Objectives:</strong>
                      {req.goals}
                    </p>
                    <p>
                      <strong className="text-slate-900 block mb-0.5">Personal Context:</strong>
                      "{req.message}"
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 pt-1">
                    Submitted on {formatDate(req.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {req.status === 'PENDING' && (
                    <>
                      <form action={async () => {
                        'use server'
                        await respondToMentorshipRequest(req.id, 'ACCEPTED', 'Accepted mentorship request.')
                      }}>
                        <Button size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                          <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Accept Mentee
                        </Button>
                      </form>
                      <form action={async () => {
                        'use server'
                        await respondToMentorshipRequest(req.id, 'DECLINED', 'Currently at capacity.')
                      }}>
                        <Button size="sm" variant="outline" type="submit" className="text-xs text-red-600 border-red-200">
                          <XCircle className="mr-1.5 h-3.5 w-3.5" /> Decline
                        </Button>
                      </form>
                    </>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <>
                      <Button size="sm" variant="outline" asChild className="text-xs">
                        <Link href="/messages">Open Chat</Link>
                      </Button>
                      <form action={async () => {
                        'use server'
                        await respondToMentorshipRequest(req.id, 'COMPLETED', 'Milestone sprint completed.')
                      }}>
                        <Button size="sm" variant="secondary" type="submit" className="text-xs">
                          <CheckSquare className="mr-1.5 h-3.5 w-3.5" /> Mark Completed
                        </Button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

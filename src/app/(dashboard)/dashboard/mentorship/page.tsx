import Link from 'next/link'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { GraduationCap, ArrowRight, CheckCircle2, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MentorshipOverviewPage() {
  const session = await auth()
  const userId = session?.user?.id!

  let mentorships: any[] = []
  try {
    mentorships = await prisma.mentorshipRequest.findMany({
      where: { senderId: userId },
      include: {
        mentor: true,
        mentorProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.warn('DB error fetching mentorships:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
            Mentorship & Advisory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track active mentorship guidance, regulatory review sprint requests, and operator advice.
          </p>
        </div>

        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Link href="/mentors">
            <GraduationCap className="mr-1.5 h-4 w-4" />
            Find New Mentor
          </Link>
        </Button>
      </div>

      {mentorships.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-dashed border-slate-300 rounded-2xl">
          <GraduationCap className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Active Mentorship Engagements</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto mb-6">
            Get personalized advice from former founders and executives who have built and exited Indian startups.
          </p>
          <Button asChild className="bg-[#1e3a5f] text-white">
            <Link href="/mentors">Browse Verified Mentors</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {mentorships.map((req: any) => (
            <Card key={req.id} className="p-6 bg-white border border-slate-200 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{req.mentor.name}</h3>
                    <Badge
                      variant={
                        req.status === 'ACCEPTED'
                          ? 'default'
                          : req.status === 'PENDING'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="text-[10px]"
                    >
                      {req.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500">{req.mentorProfile?.headline}</p>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 mt-2 space-y-1">
                    <p><strong>Your Stated Goals:</strong> {req.goals}</p>
                    {req.responseMessage && (
                      <p className="text-emerald-800 pt-1"><strong>Mentor Response:</strong> "{req.responseMessage}"</p>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Requested on {formatDate(req.createdAt)}
                  </p>
                </div>

                {req.status === 'ACCEPTED' && (
                  <Button size="sm" asChild className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white text-xs">
                    <Link href="/messages">Open Messaging</Link>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

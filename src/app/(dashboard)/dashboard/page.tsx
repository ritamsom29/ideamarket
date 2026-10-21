import Link from 'next/link'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getStartupRecommendations } from '@/lib/services/startups'
import { DEMO_STARTUPS } from '@/lib/demo-data'
import {
  Lightbulb,
  TrendingUp,
  GraduationCap,
  Users,
  MessageSquare,
  ArrowRight,
  FilePlus,
  Heart,
  CheckCircle2,
  Clock,
  Building2,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id!
  const role = session?.user?.role!
  const userName = session?.user?.name || 'Partner'

  // Load user data based on role
  let entrepreneurData = null
  let investorData = null
  let mentorData = null

  try {
    if (role === 'ENTREPRENEUR') {
      const [startups, interests, connections, mentorships, profile] = await Promise.all([
        prisma.startup.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.investmentInterest.findMany({
          where: { startup: { userId } },
          include: {
            investorUser: true,
            investorProfile: true,
            startup: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.connectionRequest.count({
          where: { receiverId: userId, status: 'PENDING' },
        }),
        prisma.mentorshipRequest.count({
          where: { senderId: userId, status: 'ACCEPTED' },
        }),
        prisma.entrepreneurProfile.findUnique({
          where: { userId },
        }),
      ])

      const publishedCount = startups.filter(s => s.status === 'PUBLISHED').length
      const draftCount = startups.filter(s => s.status === 'DRAFT').length
      const totalFundingRaised = startups.reduce((acc, s) => acc + Number(s.fundingRaisedINR || 0), 0)

      // Calculate profile completion percentage
      let completion = 20
      if (profile?.bio) completion += 20
      if (profile?.location) completion += 20
      if (profile?.linkedinUrl) completion += 20
      if (startups.length > 0) completion += 20

      entrepreneurData = {
        startups,
        publishedCount,
        draftCount,
        totalFundingRaised,
        interests,
        pendingConnections: connections,
        activeMentorships: mentorships,
        completion,
      }
    } else if (role === 'INVESTOR') {
      const [saved, interests, connections, profile] = await Promise.all([
        prisma.savedStartup.findMany({
          where: { userId },
          include: {
            startup: {
              include: { user: true, industries: { include: { industry: true } } },
            },
          },
        }),
        prisma.investmentInterest.findMany({
          where: { investorUserId: userId },
          include: { startup: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.connectionRequest.count({
          where: {
            OR: [{ senderId: userId }, { receiverId: userId }],
            status: 'ACCEPTED',
          },
        }),
        prisma.investorProfile.findUnique({
          where: { userId },
          include: { preferredIndustries: { include: { industry: true } } },
        }),
      ])

      const recommendations = await getStartupRecommendations({
        industries: profile?.preferredIndustries.map(p => p.industry.slug),
        stages: profile?.preferredStages,
        minBudget: profile?.minInvestmentINR ? Number(profile.minInvestmentINR) : undefined,
        maxBudget: profile?.maxInvestmentINR ? Number(profile.maxInvestmentINR) : undefined,
      })

      investorData = {
        savedStartups: saved,
        interests,
        acceptedConnections: connections,
        recommendations: recommendations.slice(0, 3),
        completion: profile?.investmentThesis ? 100 : 70,
      }
    } else if (role === 'MENTOR') {
      const [requests, mentees, profile] = await Promise.all([
        prisma.mentorshipRequest.findMany({
          where: { mentorId: userId },
          include: { sender: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.mentorshipRequest.count({
          where: { mentorId: userId, status: 'ACCEPTED' },
        }),
        prisma.mentorProfile.findUnique({
          where: { userId },
        }),
      ])

      mentorData = {
        requests,
        activeMenteesCount: mentees,
        isAvailable: profile?.isAvailable ?? true,
        completion: profile?.headline ? 100 : 60,
      }
    }
  } catch (error) {
    console.warn('Dashboard DB query error, using fallback state:', error)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
            Welcome back, {userName}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is your ecosystem summary and active engagement pipeline.
          </p>
        </div>

        {role === 'ENTREPRENEUR' && (
          <Button asChild className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white shadow-sm">
            <Link href="/dashboard/startups/new">
              <FilePlus className="mr-2 h-4 w-4" />
              Create Startup
            </Link>
          </Button>
        )}
        {role === 'INVESTOR' && (
          <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
            <Link href="/startups">
              Discover New Deals
            </Link>
          </Button>
        )}
      </div>

      {/* ENTREPRENEUR VIEW */}
      {role === 'ENTREPRENEUR' && (
        <>
          {/* Completion Progress Bar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Founder Profile Completion</span>
                <span className="text-teal-700">{entrepreneurData?.completion || 80}%</span>
              </div>
              <Progress value={entrepreneurData?.completion || 80} />
            </div>
            {(entrepreneurData?.completion || 80) < 100 && (
              <Button size="sm" variant="outline" asChild className="text-xs">
                <Link href="/profile">Complete Profile</Link>
              </Button>
            )}
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-6 bg-white border border-slate-200">
              <p className="text-xs font-medium text-slate-500">Total Startups</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                {entrepreneurData?.startups.length || 0}
              </p>
              <div className="mt-2 flex gap-2 text-[11px] text-slate-500">
                <span className="text-emerald-600 font-semibold">{entrepreneurData?.publishedCount || 0} Published</span>
                <span>•</span>
                <span className="text-amber-600 font-semibold">{entrepreneurData?.draftCount || 0} Draft</span>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-slate-200">
              <p className="text-xs font-medium text-slate-500">Investor Interest</p>
              <p className="text-2xl sm:text-3xl font-bold text-teal-700 mt-2">
                {entrepreneurData?.interests.length || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-2">Formal syndicate queries</p>
            </Card>

            <Card className="p-6 bg-white border border-slate-200">
              <p className="text-xs font-medium text-slate-500">Pending Connections</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] mt-2">
                {entrepreneurData?.pendingConnections || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-2">Awaiting your response</p>
            </Card>

            <Card className="p-6 bg-white border border-slate-200">
              <p className="text-xs font-medium text-slate-500">Active Mentorships</p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-2">
                {entrepreneurData?.activeMentorships || 0}
              </p>
              <p className="text-[11px] text-slate-400 mt-2">Operator advisors</p>
            </Card>
          </div>

          {/* Startups Table & Recent Interests */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-lg">My Startups</CardTitle>
                    <CardDescription className="text-xs">Manage listing statuses and investor visibility</CardDescription>
                  </div>
                  <Button size="sm" variant="ghost" asChild className="text-xs">
                    <Link href="/dashboard/startups">View all</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {(!entrepreneurData?.startups || entrepreneurData.startups.length === 0) ? (
                    <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
                      <Lightbulb className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-800">No startups created yet</p>
                      <p className="text-xs text-slate-500 mt-1 mb-4">Publish your venture to connect with Indian investors.</p>
                      <Button size="sm" asChild className="bg-[#1e3a5f]">
                        <Link href="/dashboard/startups/new">Create Your First Startup</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {entrepreneurData.startups.map((s: any) => (
                        <div key={s.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                              <Badge variant={s.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px]">
                                {s.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{s.tagline}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" asChild className="text-xs">
                              <Link href={`/startups/${s.slug}`}>Preview</Link>
                            </Button>
                            <Button size="sm" variant="secondary" asChild className="text-xs">
                              <Link href={`/dashboard/startups/${s.id}/edit`}>Edit</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Investor Interest Pipeline */}
            <div>
              <Card className="bg-white border border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Investor Interest</CardTitle>
                  <CardDescription className="text-xs">Inquiries from accredited capital allocators</CardDescription>
                </CardHeader>
                <CardContent>
                  {(!entrepreneurData?.interests || entrepreneurData.interests.length === 0) ? (
                    <p className="text-xs text-slate-500 py-6 text-center">
                      No investor interest requests yet. Once you publish your startup, queries will appear here.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {entrepreneurData.interests.slice(0, 4).map((interest: any) => (
                        <div key={interest.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-slate-900">{interest.investorUser.name}</span>
                            <Badge variant="outline" className="text-[10px] uppercase">
                              {interest.status}
                            </Badge>
                          </div>
                          <p className="text-slate-600 line-clamp-2">{interest.message}</p>
                          <Link href="/dashboard/interests" className="inline-block mt-2 font-semibold text-teal-700 hover:underline">
                            Manage Request →
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* INVESTOR VIEW */}
      {role === 'INVESTOR' && (
        <>
          {/* Top Investor Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="p-6 bg-white border border-slate-200">
              <p className="text-xs font-medium text-slate-500">Saved Startups</p>
              <p className="text-3xl font-bold text-[#1e3a5f] mt-2">
                {investorData?.savedStartups.length || 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">In your private watchlist</p>
            </Card>

            <Card className="p-6 bg-white border border-slate-200">
              <p className="text-xs font-medium text-slate-500">Expressed Interests</p>
              <p className="text-3xl font-bold text-teal-700 mt-2">
                {investorData?.interests.length || 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">Active founder discussions</p>
            </Card>

            <Card className="p-6 bg-white border border-slate-200">
              <p className="text-xs font-medium text-slate-500">Network Connections</p>
              <p className="text-3xl font-bold text-emerald-700 mt-2">
                {investorData?.acceptedConnections || 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">Accepted founder contacts</p>
            </Card>
          </div>

          {/* Recommended Startups */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recommended Opportunities</h2>
                <p className="text-xs text-slate-500">
                  Transparent rule-based matchmaking based on your ticket size and sector focus.
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/startups">Explore All Startups →</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {investorData?.recommendations?.map((item: any) => (
                <Card key={item.startup.id} className="p-6 bg-white border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold">
                      {item.score}% Match
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {item.startup.stage.replace('_', ' ')}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{item.startup.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-4">{item.startup.tagline}</p>

                  <div className="space-y-1 text-xs text-slate-600 mb-4 pt-3 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target</span>
                      <span className="font-semibold">{formatCurrency(item.startup.fundingGoalINR)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location</span>
                      <span>{item.startup.location}</span>
                    </div>
                  </div>

                  <Button asChild size="sm" className="w-full bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
                    <Link href={`/startups/${item.startup.slug}`}>Review Pitch</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MENTOR VIEW */}
      {role === 'MENTOR' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border border-slate-200">
              <p className="text-xs font-medium text-slate-500">Incoming Requests</p>
              <p className="text-3xl font-bold text-[#1e3a5f] mt-2">
                {mentorData?.requests.length || 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">Pending founder reviews</p>
            </Card>

            <Card className="p-6 bg-white border border-slate-200">
              <p className="text-xs font-medium text-slate-500">Active Mentees</p>
              <p className="text-3xl font-bold text-emerald-700 mt-2">
                {mentorData?.activeMenteesCount || 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">Advisory partnerships</p>
            </Card>
          </div>

          <Card className="bg-white border border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Mentorship Requests</CardTitle>
              <CardDescription className="text-xs">Founders seeking your guidance</CardDescription>
            </CardHeader>
            <CardContent>
              {(!mentorData?.requests || mentorData.requests.length === 0) ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No mentorship requests yet. Founders browsing the mentor directory can submit requests here.
                </p>
              ) : (
                <div className="space-y-4">
                  {mentorData.requests.map((req: any) => (
                    <div key={req.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{req.sender.name}</h4>
                          <Badge variant="outline" className="text-[10px]">{req.status}</Badge>
                        </div>
                        <p className="text-xs text-slate-600 mt-1"><strong>Goals:</strong> {req.goals}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{req.message}</p>
                      </div>

                      <Button size="sm" asChild className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white text-xs">
                        <Link href="/dashboard/mentorship-requests">Manage Request</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

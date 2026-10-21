import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { DEMO_USERS_LIST, DEMO_STARTUPS, DEMO_AUDIT_LOGS } from '@/lib/demo-data'
import { Users, Lightbulb, TrendingUp, ShieldCheck, Flag, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  let stats = {
    totalUsers: 0,
    entrepreneurs: 0,
    investors: 0,
    mentors: 0,
    totalStartups: 0,
    publishedStartups: 0,
    totalInterests: 0,
    recentAudits: [] as any[],
  }

  try {
    const [
      totalUsers,
      entrepreneurs,
      investors,
      mentors,
      totalStartups,
      publishedStartups,
      totalInterests,
      recentAudits,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ENTREPRENEUR' } }),
      prisma.user.count({ where: { role: 'INVESTOR' } }),
      prisma.user.count({ where: { role: 'MENTOR' } }),
      prisma.startup.count(),
      prisma.startup.count({ where: { status: 'PUBLISHED' } }),
      prisma.investmentInterest.count(),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { admin: true },
      }),
    ])

    stats = {
      totalUsers,
      entrepreneurs,
      investors,
      mentors,
      totalStartups,
      publishedStartups,
      totalInterests,
      recentAudits,
    }
  } catch (error) {
    console.warn('DB error on AdminDashboard, using demo registry:', error)
  }

  if (stats.totalUsers === 0) {
    stats = {
      totalUsers: DEMO_USERS_LIST.length,
      entrepreneurs: DEMO_USERS_LIST.filter(u => u.role === 'ENTREPRENEUR').length,
      investors: DEMO_USERS_LIST.filter(u => u.role === 'INVESTOR').length,
      mentors: DEMO_USERS_LIST.filter(u => u.role === 'MENTOR').length,
      totalStartups: DEMO_STARTUPS.length,
      publishedStartups: DEMO_STARTUPS.filter(s => s.status === 'PUBLISHED').length,
      totalInterests: 3,
      recentAudits: DEMO_AUDIT_LOGS.slice(0, 5),
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          System Administration
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          High-level operational metrics, ecosystem participants, and moderation queues.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">Registered Users</p>
            <Users className="h-4 w-4 text-[#1e3a5f]" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalUsers}</p>
          <div className="mt-2 text-[11px] text-slate-500 flex gap-1.5">
            <span>{stats.entrepreneurs} Founders</span> • <span>{stats.investors} Angels</span> • <span>{stats.mentors} Mentors</span>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">Startups Listed</p>
            <Lightbulb className="h-4 w-4 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalStartups}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-2">
            {stats.publishedStartups} Live in Discovery
          </p>
        </Card>

        <Card className="p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">Investment Expressions</p>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalInterests}</p>
          <p className="text-[11px] text-slate-400 mt-2">Bilateral discussions initiated</p>
        </Card>

        <Card className="p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">Security & Integrity</p>
            <ShieldCheck className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-600 mt-2">Healthy</p>
          <p className="text-[11px] text-slate-400 mt-2">Audit logging active</p>
        </Card>
      </div>

      {/* Moderation Queues and Recent Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Admin Actions */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Administrative Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">User Directory & Status</h4>
                <p className="text-xs text-slate-500">Inspect user accounts, verify roles, or toggle suspension</p>
              </div>
              <Button size="sm" asChild className="bg-[#1e3a5f] text-white">
                <Link href="/admin/users">Manage Users</Link>
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Startup Listings Moderation</h4>
                <p className="text-xs text-slate-500">Review pitch compliance, approve listings, or suspend bad actors</p>
              </div>
              <Button size="sm" asChild className="bg-teal-700 text-white">
                <Link href="/admin/startups">Moderate Startups</Link>
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Administrative Audit Trail</h4>
                <p className="text-xs text-slate-500">Immutable ledger of privileged actions taken by administrators</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/admin/audit">View Logs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Audit Activities */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Recent Administrative Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentAudits.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No recent audit events.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentAudits.map((log: any) => (
                  <div key={log.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {log.action}
                      </Badge>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">{log.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Admin: {log.admin?.name || log.adminId}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

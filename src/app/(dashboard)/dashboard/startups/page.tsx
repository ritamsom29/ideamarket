import Link from 'next/link'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { setStartupStatus } from '@/actions/startups'
import { DEMO_STARTUPS } from '@/lib/demo-data'
import { StartupStatus } from '@prisma/client'
import {
  Lightbulb,
  Plus,
  Eye,
  Edit,
  Trash2,
  Archive,
  ArrowUpRight,
  IndianRupee,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MyStartupsPage() {
  const session = await auth()
  const userId = session?.user?.id!

  let startups: any[] = []
  try {
    startups = await prisma.startup.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        industries: { include: { industry: true } },
      },
    })
  } catch (error) {
    console.warn('DB query error on MyStartups:', error)
  }

  if (startups.length === 0) {
    const demoMatches = DEMO_STARTUPS.filter(
      s => s.founder.id === userId || (userId === 'usr-aarav' && s.slug === 'payflow-india')
    )
    if (demoMatches.length > 0) {
      startups = demoMatches.map(d => ({
        ...d,
        fundingRaisedINR: BigInt(d.fundingRaisedINR),
        fundingGoalINR: BigInt(d.fundingGoalINR),
        monthlyRevenue: BigInt(d.monthlyRevenue),
        industries: d.industries.map(i => ({ industry: i })),
      })) as any
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
            My Startups
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your company listings, draft pitches, and investor visibility statuses.
          </p>
        </div>

        <Button asChild className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
          <Link href="/dashboard/startups/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Create Startup
          </Link>
        </Button>
      </div>

      {startups.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-dashed border-slate-300 rounded-2xl">
          <Lightbulb className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Startups Created Yet</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto mb-6">
            Publish your venture to start receiving investment interest from accredited angel syndicates.
          </p>
          <Button asChild className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
            <Link href="/dashboard/startups/new">Create Your First Startup</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {startups.map((startup: any) => (
            <Card key={startup.id} className="p-6 bg-white border border-slate-200 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">{startup.name}</h3>
                    <Badge
                      variant={
                        startup.status === 'PUBLISHED'
                          ? 'default'
                          : startup.status === 'DRAFT'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="text-[10px]"
                    >
                      {startup.status}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {startup.stage.replace('_', ' ')}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1">{startup.tagline}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
                    <span>Target: <strong>{formatCurrency(startup.fundingGoalINR) || 'Undisclosed'}</strong></span>
                    <span>•</span>
                    <span>Location: <strong>{startup.location}</strong></span>
                    <span>•</span>
                    <span>Created: <strong>{formatDate(startup.createdAt)}</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {startup.status === 'PUBLISHED' && (
                    <Button size="sm" variant="ghost" asChild className="text-xs">
                      <Link href={`/startups/${startup.slug}`}>
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        Public View
                      </Link>
                    </Button>
                  )}

                  {/* Toggle publish / unpublish forms */}
                  {startup.status === 'PUBLISHED' ? (
                    <form action={async () => {
                      'use server'
                      await setStartupStatus(startup.id, StartupStatus.DRAFT)
                    }}>
                      <Button size="sm" variant="outline" type="submit" className="text-xs">
                        Unpublish
                      </Button>
                    </form>
                  ) : (
                    <form action={async () => {
                      'use server'
                      await setStartupStatus(startup.id, StartupStatus.PUBLISHED)
                    }}>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs" type="submit">
                        Publish Listing
                      </Button>
                    </form>
                  )}

                  {startup.status !== 'ARCHIVED' && (
                    <form action={async () => {
                      'use server'
                      await setStartupStatus(startup.id, StartupStatus.ARCHIVED)
                    }}>
                      <Button size="sm" variant="ghost" type="submit" className="text-xs text-slate-500">
                        <Archive className="mr-1.5 h-3.5 w-3.5" />
                        Archive
                      </Button>
                    </form>
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

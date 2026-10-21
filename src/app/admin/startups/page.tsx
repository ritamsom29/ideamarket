import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/utils'
import { moderateStartup } from '@/actions/admin'
import { DEMO_STARTUPS } from '@/lib/demo-data'
import { CheckCircle2, ShieldAlert, Eye, Lightbulb } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminStartupsPage() {
  let startups: any[] = []
  try {
    startups = await prisma.startup.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  } catch (error) {
    console.warn('DB error on AdminStartupsPage, using demo dataset:', error)
  }

  if (startups.length === 0) {
    startups = DEMO_STARTUPS.map(s => ({
      ...s,
      user: s.founder,
      fundingGoalINR: BigInt(s.fundingGoalINR),
      createdAt: s.publishedAt,
    })) as any
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Startup Moderation
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review published and draft pitches to enforce content standards and protect platform integrity.
        </p>
      </div>

      <div className="space-y-4">
        {startups.map(s => (
          <Card key={s.id} className="p-6 bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-lg">{s.name}</h3>
                  <Badge variant={s.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px]">
                    {s.status}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {s.stage}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 line-clamp-1">{s.tagline}</p>
                <p className="text-xs text-slate-400">
                  Founder: <strong>{s.user.name}</strong> ({s.user.email}) • Target:{' '}
                  <strong>{formatCurrency(s.fundingGoalINR) || 'Undisclosed'}</strong> • Created {formatDate(s.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" asChild className="text-xs">
                  <Link href={`/startups/${s.slug}`} target="_blank">
                    <Eye className="mr-1 h-3.5 w-3.5" /> View Public Pitch
                  </Link>
                </Button>

                {s.status !== 'PUBLISHED' ? (
                  <form action={async () => {
                    'use server'
                    await moderateStartup(s.id, 'APPROVE', 'Approved by administrator')
                  }}>
                    <Button size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve & Publish
                    </Button>
                  </form>
                ) : (
                  <form action={async () => {
                    'use server'
                    await moderateStartup(s.id, 'SUSPEND', 'Suspended by administrator')
                  }}>
                    <Button size="sm" variant="outline" type="submit" className="text-red-600 border-red-200 hover:bg-red-50 text-xs">
                      <ShieldAlert className="mr-1 h-3.5 w-3.5" /> Suspend Listing
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

import Link from 'next/link'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { toggleSaveStartup } from '@/actions/interests'
import { Heart, Trash2, ArrowRight, IndianRupee } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SavedStartupsPage() {
  const session = await auth()
  const userId = session?.user?.id!

  let savedStartups: any[] = []
  try {
    savedStartups = await prisma.savedStartup.findMany({
      where: { userId },
      include: {
        startup: {
          include: {
            user: true,
            industries: { include: { industry: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.warn('DB error fetching saved startups:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
          Saved Startups Watchlist
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor milestone updates, traction progress, and funding developments for your saved opportunities.
        </p>
      </div>

      {savedStartups.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-dashed border-slate-300 rounded-2xl">
          <Heart className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Your Watchlist is Empty</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto mb-6">
            Explore active startup listings and save opportunities to track their progress here.
          </p>
          <Button asChild className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
            <Link href="/startups">Explore Startups Directory</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedStartups.map(({ startup }: any) => (
            <Card key={startup.id} className="p-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-[10px]">
                    {startup.stage.replace('_', ' ')}
                  </Badge>
                  <form action={async () => {
                    'use server'
                    await toggleSaveStartup(startup.id)
                  }}>
                    <Button size="icon" variant="ghost" type="submit" className="h-8 w-8 text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>

                <h3 className="font-bold text-slate-900 text-lg">{startup.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{startup.tagline}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Capital</span>
                  <span className="font-bold text-[#1e3a5f]">
                    {formatCurrency(startup.fundingGoalINR) || 'Undisclosed'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location</span>
                  <span className="font-medium text-slate-700">{startup.location}</span>
                </div>

                <Button asChild className="w-full bg-[#1e3a5f] hover:bg-[#0f2848] text-white mt-3" size="sm">
                  <Link href={`/startups/${startup.slug}`}>
                    Review Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

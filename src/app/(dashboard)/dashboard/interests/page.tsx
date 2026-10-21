import Link from 'next/link'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { respondToInvestmentInterest, withdrawInvestmentInterest } from '@/actions/interests'
import { TrendingUp, CheckCircle, XCircle, Clock, Undo2, Building2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function InvestmentInterestsPage() {
  const session = await auth()
  const userId = session?.user?.id!
  const role = session?.user?.role!

  let entrepreneurInterests: any[] = []
  let investorInterests: any[] = []

  try {
    if (role === 'ENTREPRENEUR' || role === 'ADMIN') {
      entrepreneurInterests = await prisma.investmentInterest.findMany({
        where: { startup: { userId } },
        include: {
          investorUser: true,
          investorProfile: true,
          startup: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    }

    if (role === 'INVESTOR' || role === 'ADMIN') {
      investorInterests = await prisma.investmentInterest.findMany({
        where: { investorUserId: userId },
        include: {
          startup: { include: { user: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    }
  } catch (error) {
    console.warn('DB error fetching interests:', error)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
          Investment Interests Pipeline
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track formal expressions of interest, bilateral approvals, and data room permissions.
        </p>
      </div>

      {/* ENTREPRENEUR INBOUND INTERESTS */}
      {role === 'ENTREPRENEUR' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Incoming Investor Inquiries</h2>

          {entrepreneurInterests.length === 0 ? (
            <Card className="p-8 text-center bg-white border border-slate-200">
              <TrendingUp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">No investor expressions received yet</p>
              <p className="text-xs text-slate-500 mt-1">
                When accredited investors browse your published pitch and submit inquiries, they will appear here.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {entrepreneurInterests.map((interest: any) => (
                <Card key={interest.id} className="p-6 bg-white border border-slate-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{interest.investorUser.name}</h3>
                        <Badge
                          variant={
                            interest.status === 'ACCEPTED'
                              ? 'default'
                              : interest.status === 'PENDING'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="text-[10px]"
                        >
                          {interest.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-500">
                        {interest.investorProfile?.designation} at <strong>{interest.investorProfile?.organization}</strong> • Pitch: <span className="font-semibold text-slate-800">{interest.startup.name}</span>
                      </p>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 mt-2">
                        <p className="font-semibold text-slate-900 mb-1">Investor Note:</p>
                        <p className="italic">"{interest.message}"</p>
                      </div>

                      <p className="text-[11px] text-slate-400 pt-1">
                        Received on {formatDate(interest.createdAt)}
                      </p>
                    </div>

                    {interest.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <form action={async () => {
                          'use server'
                          await respondToInvestmentInterest(interest.id, 'ACCEPTED', 'Accepted via dashboard')
                        }}>
                          <Button size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                            <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Accept Interest
                          </Button>
                        </form>
                        <form action={async () => {
                          'use server'
                          await respondToInvestmentInterest(interest.id, 'DECLINED', 'Declined via dashboard')
                        }}>
                          <Button size="sm" variant="outline" type="submit" className="text-xs text-red-600 border-red-200 hover:bg-red-50">
                            <XCircle className="mr-1.5 h-3.5 w-3.5" /> Decline
                          </Button>
                        </form>
                      </div>
                    )}

                    {interest.status === 'ACCEPTED' && (
                      <Button size="sm" variant="outline" asChild className="text-xs">
                        <Link href="/messages">Open Messaging →</Link>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INVESTOR OUTBOUND INTERESTS */}
      {role === 'INVESTOR' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">My Expressed Interests</h2>

          {investorInterests.length === 0 ? (
            <Card className="p-8 text-center bg-white border border-slate-200">
              <TrendingUp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">You have not expressed interest in any startups yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Browse our curated startups and express interest to connect with ambitious founders.
              </p>
              <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white text-xs">
                <Link href="/startups">Explore Startups</Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {investorInterests.map((interest: any) => (
                <Card key={interest.id} className="p-6 bg-white border border-slate-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{interest.startup.name}</h3>
                        <Badge
                          variant={
                            interest.status === 'ACCEPTED'
                              ? 'default'
                              : interest.status === 'PENDING'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="text-[10px]"
                        >
                          {interest.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-500">
                        Founder: <strong>{interest.startup.user.name}</strong> • Expressed on {formatDate(interest.createdAt)}
                      </p>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                        <p className="font-semibold text-slate-900 mb-0.5">Your Message:</p>
                        <p className="italic">"{interest.message}"</p>
                      </div>

                      {interest.responseMessage && (
                        <div className="p-3 rounded-lg bg-teal-50 border border-teal-100 text-xs text-teal-900 mt-2">
                          <p className="font-semibold mb-0.5">Founder Response:</p>
                          <p>"{interest.responseMessage}"</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" asChild className="text-xs">
                        <Link href={`/startups/${interest.startup.slug}`}>View Pitch</Link>
                      </Button>

                      {interest.status === 'PENDING' && (
                        <form action={async () => {
                          'use server'
                          await withdrawInvestmentInterest(interest.id)
                        }}>
                          <Button size="sm" variant="ghost" type="submit" className="text-xs text-slate-500">
                            <Undo2 className="mr-1.5 h-3.5 w-3.5" /> Withdraw
                          </Button>
                        </form>
                      )}

                      {interest.status === 'ACCEPTED' && (
                        <Button size="sm" className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white text-xs" asChild>
                          <Link href="/messages">Open Chat</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

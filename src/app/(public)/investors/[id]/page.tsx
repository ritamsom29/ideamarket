import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { getInvestorById } from '@/lib/services/investors'
import { ConnectInvestorModal } from '@/components/investors/connect-investor-modal'
import { Building2, MapPin, Globe, Linkedin, ArrowLeft, Target, Briefcase } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function InvestorDetailPage({ params }: Props) {
  const session = await auth()
  const { id } = await params

  const investor = await getInvestorById(id)
  if (!investor) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar user={session?.user || null} />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/investors">
              <ArrowLeft className="h-4 w-4" /> Back to Investor Directory
            </Link>
          </Button>

          {/* Header Card */}
          <Card className="p-8 bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-5">
                <img
                  src={investor.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                  alt={investor.name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                />
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{investor.name}</h1>
                  <p className="text-sm text-teal-700 font-semibold">{investor.designation}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building2 className="h-3.5 w-3.5" /> {investor.organization}
                  </p>
                </div>
              </div>

              <ConnectInvestorModal
                investorUserId={investor.userId}
                investorName={investor.name}
                isLoggedIn={!!session?.user}
              />
            </div>

            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs border-b border-slate-100 pb-6">
              <div>
                <span className="text-slate-400 block">Typical Ticket Size</span>
                <span className="font-bold text-[#1e3a5f] text-sm mt-0.5 block">
                  {formatCurrency(investor.minInvestmentINR)} - {formatCurrency(investor.maxInvestmentINR)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Base Location</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                  {investor.location}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Geographic Focus</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                  {investor.geographicFocus?.join(', ') || 'Pan-India'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Target Stages</span>
                <span className="font-semibold text-teal-700 text-sm mt-0.5 block">
                  {investor.preferredStages?.join(', ') || 'Seed, Early'}
                </span>
              </div>
            </div>

            {/* Biography & Thesis */}
            <div className="pt-6 space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Investor Biography</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{investor.bio}</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-teal-600" /> Investment Thesis
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {investor.investmentThesis}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-3">Target Industry Sectors</h3>
                <div className="flex flex-wrap gap-2">
                  {investor.preferredIndustries?.map((ind: any) => (
                    <span
                      key={ind.id}
                      className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-medium"
                    >
                      {ind.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

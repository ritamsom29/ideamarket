import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { getInvestors } from '@/lib/services/investors'
import { DEMO_INDUSTRIES } from '@/lib/demo-data'
import { ConnectInvestorModal } from '@/components/investors/connect-investor-modal'
import { Search, MapPin, Building2, ExternalLink, Filter } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    search?: string
    industry?: string
    stage?: string
    location?: string
    page?: string
  }>
}

export default async function InvestorsPage({ searchParams }: Props) {
  const session = await auth()
  const params = await searchParams

  const search = params.search || ''
  const industry = params.industry || ''
  const stage = params.stage || ''
  const location = params.location || ''
  const page = Number(params.page) || 1

  const { investors, total, totalPages } = await getInvestors({
    search,
    industry,
    stage,
    location,
    page,
    limit: 9,
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar user={session?.user || null} />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#1e3a5f] tracking-tight sm:text-4xl">
              Investor Directory
            </h1>
            <p className="mt-2 text-base text-slate-600">
              Discover accredited angel investors, family offices, and venture capital partners actively allocating to Indian founders.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10">
            <form method="GET" action="/investors" className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  name="search"
                  defaultValue={search}
                  placeholder="Search by investor name, organization, or thesis..."
                  className="pl-9 bg-slate-50/50"
                />
              </div>

              <div>
                <select
                  name="industry"
                  defaultValue={industry}
                  className="w-full h-9 rounded-lg border border-input bg-slate-50/50 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                >
                  <option value="">All Industries</option>
                  {DEMO_INDUSTRIES.map(ind => (
                    <option key={ind.slug} value={ind.slug}>
                      {ind.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button type="submit" size="sm" className="w-full bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
                  Filter Investors
                </Button>
                {(search || industry) && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/investors">Clear</Link>
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900">{investors.length}</span> of{' '}
              <span className="font-semibold text-slate-900">{total}</span> accredited investors
            </p>
          </div>

          {/* Investor Grid */}
          {investors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <Filter className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No investors matched your filter</h3>
              <p className="mt-1 text-sm text-slate-500">Try broadening your search term or industry selection.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/investors">Reset Filters</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {investors.map((investor: any) => (
                <Card
                  key={investor.id}
                  className="p-6 bg-white border border-slate-200/80 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={investor.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                          alt={investor.name}
                          className="h-14 w-14 rounded-full object-cover border border-slate-200 shadow-sm"
                        />
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{investor.name}</h3>
                          <p className="text-xs text-teal-700 font-semibold">{investor.designation}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3 text-slate-400" /> {investor.organization}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                      {investor.bio}
                    </p>

                    {/* Preferred Industries */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {investor.preferredIndustries?.map((ind: any) => (
                        <span
                          key={ind.id}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                        >
                          {ind.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2.5">
                    {investor.showInvestmentRange && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Ticket Size</span>
                        <span className="font-bold text-slate-900">
                          {formatCurrency(investor.minInvestmentINR)} - {formatCurrency(investor.maxInvestmentINR)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Location</span>
                      <span className="text-slate-700 font-medium">{investor.location}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <Button asChild variant="outline" size="sm" className="w-full text-xs">
                        <Link href={`/investors/${investor.id}`}>View Thesis</Link>
                      </Button>

                      <ConnectInvestorModal
                        investorUserId={investor.userId}
                        investorName={investor.name}
                        isLoggedIn={!!session?.user}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNumber = idx + 1
                return (
                  <Button
                    key={pageNumber}
                    size="sm"
                    variant={pageNumber === page ? 'default' : 'outline'}
                    className={pageNumber === page ? 'bg-[#1e3a5f]' : ''}
                    asChild
                  >
                    <Link
                      href={{
                        pathname: '/investors',
                        query: { ...params, page: pageNumber },
                      }}
                    >
                      {pageNumber}
                    </Link>
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatCurrency, STARTUP_STAGES } from '@/lib/utils'
import { getPublishedStartups } from '@/lib/services/startups'
import { DEMO_INDUSTRIES } from '@/lib/demo-data'
import { Search, Filter, MapPin, IndianRupee, Users, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    search?: string
    industry?: string
    stage?: string
    minFunding?: string
    maxFunding?: string
    location?: string
    sortBy?: 'newest' | 'funding_high' | 'funding_low' | 'name'
    page?: string
  }>
}

export default async function ExploreStartupsPage({ searchParams }: Props) {
  const session = await auth()
  const params = await searchParams

  const search = params.search || ''
  const industry = params.industry || ''
  const stage = params.stage || ''
  const location = params.location || ''
  const sortBy = params.sortBy || 'newest'
  const page = Number(params.page) || 1
  const minFunding = params.minFunding ? Number(params.minFunding) : undefined
  const maxFunding = params.maxFunding ? Number(params.maxFunding) : undefined

  const { startups, total, totalPages } = await getPublishedStartups({
    search,
    industry,
    stage,
    location,
    sortBy,
    page,
    limit: 9,
    minFunding,
    maxFunding,
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar user={session?.user || null} />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#1e3a5f] tracking-tight sm:text-4xl">
              Explore Startups
            </h1>
            <p className="mt-2 text-base text-slate-600">
              Discover vetted, investment-ready startups across India's fastest growing technology sectors.
            </p>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10">
            <form method="GET" action="/startups" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    name="search"
                    defaultValue={search}
                    placeholder="Search startups by name, solution, or keywords..."
                    className="pl-9 bg-slate-50/50"
                  />
                </div>

                {/* Industry Filter */}
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

                {/* Stage Filter */}
                <div>
                  <select
                    name="stage"
                    defaultValue={stage}
                    className="w-full h-9 rounded-lg border border-input bg-slate-50/50 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  >
                    <option value="">All Stages</option>
                    {STARTUP_STAGES.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Advanced controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <Input
                    name="location"
                    defaultValue={location}
                    placeholder="City / State (e.g., Bengaluru)"
                    className="h-8 text-xs w-full sm:w-48 bg-slate-50/50"
                  />

                  <select
                    name="sortBy"
                    defaultValue={sortBy}
                    className="h-8 rounded-md border border-input bg-slate-50/50 px-2 text-xs focus:outline-none"
                  >
                    <option value="newest">Recently Published</option>
                    <option value="funding_high">Funding: High to Low</option>
                    <option value="funding_low">Funding: Low to High</option>
                    <option value="name">Alphabetical</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button type="submit" size="sm" className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
                    Apply Filters
                  </Button>
                  {(search || industry || stage || location) && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/startups">Clear</Link>
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900">{startups.length}</span> of{' '}
              <span className="font-semibold text-slate-900">{total}</span> published startups
            </p>
          </div>

          {/* Startup Grid */}
          {startups.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <Filter className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No startups matched your criteria</h3>
              <p className="mt-1 text-sm text-slate-500">Try adjusting your keyword search or filter options.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/startups">Reset All Filters</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {startups.map((startup: any) => (
                <Card
                  key={startup.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-slate-200/80 bg-white flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={startup.coverImageUrl || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800'}
                      alt={startup.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/95 text-slate-800 shadow-sm border-slate-200">
                        {startup.stage.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {startup.industries.map((ind: any) => (
                          <span
                            key={ind.id}
                            className="text-[11px] px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-medium"
                          >
                            {ind.name}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{startup.name}</h3>
                      <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {startup.tagline}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5 text-slate-400" /> Target Capital
                        </span>
                        <span className="font-bold text-[#1e3a5f] text-sm">
                          {formatCurrency(startup.fundingGoalINR) || 'Undisclosed'}
                        </span>
                      </div>

                      {startup.equityOffered && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Equity Offered</span>
                          <span className="font-semibold text-emerald-700">
                            {startup.equityOffered}%
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" /> Location
                        </span>
                        <span className="text-slate-700 font-medium">{startup.location}</span>
                      </div>

                      <div className="pt-2">
                        <Button asChild className="w-full bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
                          <Link href={`/startups/${startup.slug}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
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
                        pathname: '/startups',
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

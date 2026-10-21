import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getMentors } from '@/lib/services/mentors'
import { DEMO_INDUSTRIES } from '@/lib/demo-data'
import { RequestMentorshipModal } from '@/components/mentors/request-mentorship-modal'
import { Search, MapPin, Award, CheckCircle2, Filter } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    search?: string
    industry?: string
    expertise?: string
    location?: string
    page?: string
  }>
}

export default async function MentorsPage({ searchParams }: Props) {
  const session = await auth()
  const params = await searchParams

  const search = params.search || ''
  const industry = params.industry || ''
  const expertise = params.expertise || ''
  const location = params.location || ''
  const page = Number(params.page) || 1

  const { mentors, total, totalPages } = await getMentors({
    search,
    industry,
    expertise,
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
              Mentor Directory
            </h1>
            <p className="mt-2 text-base text-slate-600">
              Connect with seasoned entrepreneurs, product leaders, and domain veterans who have scaled Indian ventures.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10">
            <form method="GET" action="/mentors" className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  name="search"
                  defaultValue={search}
                  placeholder="Search mentors by name, company background, or skills..."
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
                  Filter Mentors
                </Button>
                {(search || industry) && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/mentors">Clear</Link>
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900">{mentors.length}</span> of{' '}
              <span className="font-semibold text-slate-900">{total}</span> verified mentors
            </p>
          </div>

          {/* Mentor Grid */}
          {mentors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <Filter className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No mentors matched your query</h3>
              <p className="mt-1 text-sm text-slate-500">Try searching for other domain expertise or reset filters.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/mentors">Reset Filters</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mentors.map((mentor: any) => (
                <Card
                  key={mentor.id}
                  className="p-6 bg-white border border-slate-200/80 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={mentor.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                        alt={mentor.name}
                        className="h-16 w-16 rounded-full object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{mentor.name}</h3>
                          {mentor.isAvailable ? (
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Available for mentorship" />
                          ) : (
                            <span className="flex h-2 w-2 rounded-full bg-slate-300" title="Capacity full" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                          {mentor.headline}
                        </p>
                        <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold">
                          {mentor.yearsExperience}+ Years Experience
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                      {mentor.bio}
                    </p>

                    {/* Expertise pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {mentor.expertiseAreas?.slice(0, 4).map((exp: string) => (
                        <span
                          key={exp}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Location</span>
                      <span className="text-slate-700 font-medium">{mentor.location}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <Button asChild variant="outline" size="sm" className="w-full text-xs">
                        <Link href={`/mentors/${mentor.id}`}>View Background</Link>
                      </Button>

                      <RequestMentorshipModal
                        mentorUserId={mentor.userId}
                        mentorName={mentor.name}
                        isLoggedIn={!!session?.user}
                        isAvailable={mentor.isAvailable}
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
                        pathname: '/mentors',
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

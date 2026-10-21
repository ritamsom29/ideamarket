import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { getFeaturedStartups } from '@/lib/services/startups'
import { getFeaturedInvestors } from '@/lib/services/investors'
import { getFeaturedMentors } from '@/lib/services/mentors'
import {
  Lightbulb,
  TrendingUp,
  ShieldCheck,
  Users,
  ArrowRight,
  CheckCircle2,
  Building2,
  Sparkles,
  HelpCircle,
  Briefcase,
  Compass,
  FileCheck,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const session = await auth()
  const featuredStartups = await getFeaturedStartups(3)
  const featuredInvestors = await getFeaturedInvestors(3)
  const featuredMentors = await getFeaturedMentors(3)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={session?.user || null} />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-20 lg:py-28 border-b border-border">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a5f08_1px,transparent_1px),linear-gradient(to_bottom,#1e3a5f08_1px,transparent_1px)] bg-[size:32px_32px]" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              Empowering India's Next Generation of Founders
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1e3a5f] max-w-4xl mx-auto leading-tight">
              Your Ideas Deserve the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                Right Investment.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover opportunities, connect with investors, and turn ambitious ideas into meaningful businesses.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="xl" asChild className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white shadow-lg w-full sm:w-auto">
                <Link href="/startups">
                  Explore Startups
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="w-full sm:w-auto border-slate-300 hover:bg-slate-50">
                <Link href="/register?role=ENTREPRENEUR">
                  Showcase Your Idea
                </Link>
              </Button>
            </div>

            {/* Quick metrics banner */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/80">
              <div className="p-4 rounded-xl bg-white/70 border border-slate-100 shadow-sm">
                <p className="text-2xl sm:text-3xl font-bold text-[#1e3a5f]">₹100Cr+</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Capital Facilitated</p>
              </div>
              <div className="p-4 rounded-xl bg-white/70 border border-slate-100 shadow-sm">
                <p className="text-2xl sm:text-3xl font-bold text-teal-600">500+</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Curated Startups</p>
              </div>
              <div className="p-4 rounded-xl bg-white/70 border border-slate-100 shadow-sm">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-600">250+</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Active Angels & VCs</p>
              </div>
              <div className="p-4 rounded-xl bg-white/70 border border-slate-100 shadow-sm">
                <p className="text-2xl sm:text-3xl font-bold text-amber-600">120+</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Industry Mentors</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 bg-white" id="how-it-works">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="teal" className="mb-3">Streamlined Process</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-[#1e3a5f] sm:text-4xl">
                How Idea Market Works
              </h2>
              <p className="mt-4 text-base text-slate-600">
                A verified, transparent marketplace structured to help high-potential Indian startups meet aligned growth capital and seasoned advisors.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:border-teal-500/50 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700 font-bold text-lg mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900">Publish Your Business Case</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Entrepreneurs build comprehensive pitch profiles with problem statements, product roadmaps, financial unit economics, and verified documents.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-600" /> 6-step guided creation wizard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-600" /> Secure confidential data rooms
                  </li>
                </ul>
              </div>

              <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:border-teal-500/50 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#1e3a5f] font-bold text-lg mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900">Express Mutual Interest</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Accredited investors discover deals matching their ticket size, thesis, and target stage. Non-binding interest expressions initiate direct dialogue.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1e3a5f]" /> Transparent compatibility scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1e3a5f]" /> Direct bilateral connections
                  </li>
                </ul>
              </div>

              <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-8 hover:border-teal-500/50 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-lg mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900">Engage Advisors & Scale</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Entrepreneurs connect with veteran startup operators for regulatory compliance, product-market fit audits, and fundraising guidance.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Structured mentorship requests
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Integrated private messaging
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED STARTUPS */}
        <section className="py-20 bg-slate-50 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <Badge variant="blue" className="mb-2">Featured Opportunities</Badge>
                <h2 className="text-3xl font-bold text-[#1e3a5f]">Curated Indian Startups</h2>
                <p className="mt-2 text-sm text-slate-600">
                  High-growth ventures actively seeking seed to growth stage investment.
                </p>
              </div>
              <Button variant="ghost" asChild className="mt-4 md:mt-0 text-[#1e3a5f] hover:text-[#0f2848]">
                <Link href="/startups" className="flex items-center gap-2">
                  View all startups <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredStartups.map((startup: any) => (
                <Card key={startup.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={startup.coverImageUrl || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800'}
                      alt={startup.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/95 text-slate-800 shadow-sm border-slate-200">
                        {startup.stage.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        {startup.industries.map((ind: any) => (
                          <span
                            key={ind.id}
                            className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                          >
                            {ind.name}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{startup.name}</h3>
                      <p className="mt-1 text-sm text-slate-600 line-clamp-2">{startup.tagline}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <span>Target Capital</span>
                        <span className="font-semibold text-slate-900 text-sm">
                          {formatCurrency(startup.fundingGoalINR) || 'Undisclosed'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                        <span>Location</span>
                        <span className="font-medium text-slate-700">{startup.location}</span>
                      </div>

                      <Button asChild className="w-full bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
                        <Link href={`/startups/${startup.slug}`}>
                          View Details & Pitch
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED INVESTORS */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <Badge variant="teal" className="mb-2">Capital Partners</Badge>
                <h2 className="text-3xl font-bold text-[#1e3a5f]">Featured Investors & Angels</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Accredited investors actively looking for transformative founders.
                </p>
              </div>
              <Button variant="ghost" asChild className="mt-4 md:mt-0 text-[#1e3a5f]">
                <Link href="/investors" className="flex items-center gap-2">
                  View investor directory <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredInvestors.map((investor: any) => (
                <Card key={investor.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={investor.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                      alt={investor.name}
                      className="h-14 w-14 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{investor.name}</h3>
                      <p className="text-xs text-teal-700 font-medium">{investor.designation}</p>
                      <p className="text-xs text-slate-500">{investor.organization}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {investor.bio}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Investment Range</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(investor.minInvestmentINR)} - {formatCurrency(investor.maxInvestmentINR)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Location</span>
                      <span className="text-slate-700">{investor.location}</span>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full mt-5">
                    <Link href={`/investors/${investor.id}`}>View Profile & Thesis</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED MENTORS */}
        <section className="py-20 bg-slate-50 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <Badge variant="emerald" className="mb-2">Operator Guidance</Badge>
                <h2 className="text-3xl font-bold text-[#1e3a5f]">Startup Advisors & Mentors</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Decades of operator experience to guide product-market fit, unit economics, and regulations.
                </p>
              </div>
              <Button variant="ghost" asChild className="mt-4 md:mt-0 text-[#1e3a5f]">
                <Link href="/mentors" className="flex items-center gap-2">
                  View mentor directory <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredMentors.map((mentor: any) => (
                <Card key={mentor.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={mentor.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                      alt={mentor.name}
                      className="h-14 w-14 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{mentor.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{mentor.headline}</p>
                      <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                        {mentor.yearsExperience}+ Yrs Experience
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {mentor.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {mentor.expertiseAreas?.slice(0, 3).map((exp: string) => (
                      <span key={exp} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {exp}
                      </span>
                    ))}
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full mt-2">
                    <Link href={`/mentors/${mentor.id}`}>Request Guidance</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST & TRANSPARENCY SECTION */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-[#0f2848] to-[#1e3a5f] text-white p-8 sm:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <Badge className="bg-teal-500/20 text-teal-300 border-teal-400/30 mb-4">
                    Trust & Transparency
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Built for Legitimate, Real-World Venture Connections
                  </h2>
                  <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                    Idea Market enforces strict profile verification, verified cap-table uploads, and server-authorized bilateral agreements. We protect confidential pitch decks and ensure expressions of interest remain transparent and respectful.
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-200">
                        <strong>Zero fabricated activity:</strong> Platform statistics reflect genuine user records and seed data only.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileCheck className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-200">
                        <strong>Confidential documents:</strong> Private financial models are accessible only to verified investors upon founder consent.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-200">
                        <strong>INR Native:</strong> Tailored for the Indian ecosystem, GST/MCA compliance standards, and local institutional investors.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10 text-white">
                  <h3 className="text-lg font-bold mb-4">Join Idea Market Today</h3>
                  <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                    Select your journey to register your profile and access the Indian startup ecosystem network.
                  </p>

                  <div className="space-y-3">
                    <Link
                      href="/register?role=ENTREPRENEUR"
                      className="block p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">Join as Entrepreneur</p>
                          <p className="text-xs text-slate-300">Showcase your venture to active angels and VCs</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-teal-400" />
                      </div>
                    </Link>

                    <Link
                      href="/register?role=INVESTOR"
                      className="block p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">Join as Investor</p>
                          <p className="text-xs text-slate-300">Discover vetted dealflow with transparent traction</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-teal-400" />
                      </div>
                    </Link>

                    <Link
                      href="/register?role=MENTOR"
                      className="block p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">Join as Mentor</p>
                          <p className="text-xs text-slate-300">Share operator wisdom with high-potential founders</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-teal-400" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-20 bg-slate-50 border-t border-border" id="faq">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="blue" className="mb-2">Common Inquiries</Badge>
              <h2 className="text-3xl font-bold text-[#1e3a5f]">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-900 text-base">Is expressing investment interest legally binding?</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  No. Expressing investment interest indicates exploratory intent and allows founders and investors to exchange information and initiate conversations. It does not constitute a legally binding contract or financial transaction.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-900 text-base">Who can see my private startup documents?</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Documents designated as "Private" in the startup creator (such as cap tables and confidential financial audits) are hidden from the public discovery page and are accessible only after the founder grants authorized access.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-900 text-base">What currency is used on the platform?</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Idea Market is purpose-built for the Indian venture ecosystem; all funding goals, investment tickets, and revenue metrics are natively represented in Indian Rupees (INR) using Lakhs (₹L) and Crores (₹Cr).
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-900 text-base">How does startup recommendation work?</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Recommendations use transparent rule-based compatibility scoring based on declared industry preferences, stage requirements, ticket size compatibility, and geographic focus.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

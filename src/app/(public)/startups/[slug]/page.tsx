import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getStartupBySlug } from '@/lib/services/startups'
import { ExpressInterestModal } from '@/components/startups/express-interest-modal'
import {
  Building2,
  MapPin,
  Globe,
  Calendar,
  Users,
  IndianRupee,
  PieChart,
  FileText,
  Lock,
  Download,
  CheckCircle2,
  TrendingUp,
  Share2,
  ArrowLeft,
  Briefcase,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function StartupDetailPage({ params }: Props) {
  const session = await auth()
  const { slug } = await params

  const startup = await getStartupBySlug(slug)
  if (!startup) {
    notFound()
  }

  const isOwner = session?.user?.id === startup.founder.id
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar user={session?.user || null} />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Back */}
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/startups">
                <ArrowLeft className="h-4 w-4" /> Back to Startups
              </Link>
            </Button>

            {isOwner && (
              <Button size="sm" variant="outline" asChild>
                <Link href={`/dashboard/startups/${startup.id}/edit`}>
                  Edit Listing
                </Link>
              </Button>
            )}
          </div>

          {/* Hero Banner */}
          <div className="relative rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm mb-10">
            <div className="relative h-64 sm:h-80 w-full bg-slate-100 overflow-hidden">
              <img
                src={startup.coverImageUrl || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=1200'}
                alt={startup.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-white">
                <div className="flex items-center gap-4">
                  {startup.logoUrl ? (
                    <img
                      src={startup.logoUrl}
                      alt={startup.name}
                      className="h-20 w-20 rounded-2xl object-cover bg-white p-1 border-2 border-white/20 shadow-lg"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1e3a5f] text-white font-bold text-2xl border-2 border-white/20">
                      {startup.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <Badge className="bg-white/20 text-white backdrop-blur-md border-white/20">
                        {startup.stage.replace('_', ' ')}
                      </Badge>
                      {startup.fundingType && (
                        <Badge className="bg-teal-500/80 text-white">
                          {startup.fundingType.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold">{startup.name}</h1>
                    <p className="text-sm sm:text-base text-slate-200 mt-1 max-w-2xl">
                      {startup.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {startup.websiteUrl && (
                    <Button size="sm" variant="secondary" asChild className="gap-1.5">
                      <a href={startup.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" /> Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metadata Bar */}
            <div className="p-6 bg-white grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500">Target Capital</p>
                <p className="text-lg font-bold text-[#1e3a5f] mt-0.5">
                  {formatCurrency(startup.fundingGoalINR) || 'Undisclosed'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Equity Offered</p>
                <p className="text-lg font-bold text-emerald-700 mt-0.5">
                  {startup.equityOffered ? `${startup.equityOffered}%` : 'Negotiable'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Headquarters</p>
                <p className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {startup.location}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Team Size</p>
                <p className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-slate-400" /> {startup.teamSize} Members
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left 2 Cols: Deep Pitch Profile */}
            <div className="lg:col-span-2 space-y-8">
              {/* Executive Overview */}
              <Card className="p-6 sm:p-8 bg-white">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Executive Summary</h2>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {startup.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  {startup.industries.map((ind: any) => (
                    <span
                      key={ind.id}
                      className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium"
                    >
                      {ind.name}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Problem Statement & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-white border-l-4 border-l-amber-500">
                  <h3 className="font-bold text-slate-900 text-base mb-2">The Problem</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {startup.problemStatement || 'Problem statement details available in verified pitch deck.'}
                  </p>
                </Card>

                <Card className="p-6 bg-white border-l-4 border-l-teal-500">
                  <h3 className="font-bold text-slate-900 text-base mb-2">The Solution</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {startup.solutionDescription || 'Proposed solution details available in verified pitch deck.'}
                  </p>
                </Card>
              </div>

              {/* Market Opportunity & Business Model */}
              <Card className="p-6 sm:p-8 bg-white space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Product & Service</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {startup.productDescription || 'Product architecture and feature details available on request.'}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Market Opportunity</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {startup.marketOpportunity || 'Market sizing (TAM / SAM / SOM) defined in investment documents.'}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Business Model & Monetization</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {startup.businessModel || 'Revenue streams, pricing strategy, and take-rate specifications.'}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Competitive Advantage (Moat)</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {startup.competitiveAdvantage || 'Proprietary IP, network effects, and unit margin defensibility.'}
                  </p>
                </div>
              </Card>

              {/* Traction & Metrics */}
              {startup.traction && (
                <Card className="p-6 sm:p-8 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-teal-600" />
                    <h2 className="text-xl font-bold text-slate-900">Verified Traction & Metrics</h2>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-6">
                    {startup.traction}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    {startup.monthlyRevenue && (
                      <div>
                        <p className="text-xs text-slate-500">Monthly Revenue</p>
                        <p className="text-base font-bold text-slate-900 mt-0.5">
                          {formatCurrency(startup.monthlyRevenue)}
                        </p>
                      </div>
                    )}
                    {startup.monthlyActiveUsers && (
                      <div>
                        <p className="text-xs text-slate-500">Active Users / Clients</p>
                        <p className="text-base font-bold text-slate-900 mt-0.5">
                          {startup.monthlyActiveUsers.toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}
                    {startup.fundingRaisedINR && (
                      <div>
                        <p className="text-xs text-slate-500">Capital Raised to Date</p>
                        <p className="text-base font-bold text-teal-700 mt-0.5">
                          {formatCurrency(startup.fundingRaisedINR)}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Team Section */}
              <Card className="p-6 sm:p-8 bg-white">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Founding Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Founder */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-3">
                    <img
                      src={startup.founder.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={startup.founder.name}
                      className="h-12 w-12 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{startup.founder.name}</h4>
                      <p className="text-xs text-teal-700 font-medium">Founder</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{startup.founder.bio}</p>
                    </div>
                  </div>

                  {/* Team Members */}
                  {startup.teamMembers?.map((member: any) => (
                    <div
                      key={member.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-3"
                    >
                      <div className="h-12 w-12 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-bold text-sm">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                        <p className="text-xs text-slate-600 font-medium">{member.role}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{member.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Supporting Documents & Data Room */}
              <Card className="p-6 sm:p-8 bg-white">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Supporting Documents</h2>
                <p className="text-xs text-slate-500 mb-6">
                  Pitch decks and verified financial materials uploaded by the founding team.
                </p>

                {startup.documents && startup.documents.length > 0 ? (
                  <div className="space-y-3">
                    {startup.documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-50 text-[#1e3a5f]">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{doc.name}</p>
                            <p className="text-xs text-slate-500">
                              {(doc.fileSize / 1024 / 1024).toFixed(1)} MB • {doc.fileType.split('/')[1]?.toUpperCase() || 'PDF'}
                            </p>
                          </div>
                        </div>

                        <div>
                          {doc.isPublic ? (
                            <Button size="sm" variant="outline" className="gap-1.5" asChild>
                              <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="h-3.5 w-3.5" /> View Deck
                              </a>
                            </Button>
                          ) : (
                            <Badge variant="outline" className="gap-1 text-slate-500">
                              <Lock className="h-3 w-3" /> Private Document
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                    No public documents uploaded. Request access during investment interest.
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column: Investment Action Card */}
            <div className="space-y-6">
              <Card className="p-6 bg-white border border-slate-200 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Investment Overview</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Connect directly with {startup.founder.name} to discuss syndicate allocation.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-500">Fundraising Round Target</p>
                    <p className="text-2xl font-black text-[#1e3a5f] mt-1">
                      {formatCurrency(startup.fundingGoalINR) || 'Undisclosed'}
                    </p>
                    {startup.fundingRaisedINR && startup.fundingGoalINR && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Committed</span>
                          <span className="font-semibold text-slate-800">
                            {Math.round((startup.fundingRaisedINR / startup.fundingGoalINR) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-teal-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((startup.fundingRaisedINR / startup.fundingGoalINR) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Stage</span>
                      <span className="font-semibold text-slate-800">{startup.stage.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Round Type</span>
                      <span className="font-semibold text-slate-800">
                        {startup.fundingType?.replace('_', ' ') || 'Direct Equity'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Equity Dilution</span>
                      <span className="font-semibold text-emerald-700">
                        {startup.equityOffered ? `${startup.equityOffered}%` : 'Negotiable'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <ExpressInterestModal
                  startupId={startup.id}
                  startupName={startup.name}
                  isLoggedIn={!!session?.user}
                  userRole={session?.user?.role}
                />

                <p className="text-[11px] text-center text-slate-400 mt-3 leading-tight">
                  Expressions are non-binding exploratory requests subject to founder consent.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

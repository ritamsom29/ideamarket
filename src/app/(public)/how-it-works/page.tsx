import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Lightbulb,
  TrendingUp,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Users,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HowItWorksPage() {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={session?.user || null} />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="teal" className="mb-3">Platform Guide</Badge>
            <h1 className="text-4xl font-extrabold text-[#1e3a5f] sm:text-5xl tracking-tight">
              How Idea Market Works
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              A comprehensive guide to publishing startup ventures, conducting investor due diligence, and structuring mentorship engagements.
            </p>
          </div>

          {/* Section: For Entrepreneurs */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
              <div className="p-2.5 rounded-xl bg-blue-100 text-[#1e3a5f]">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">For Entrepreneurs & Founders</h2>
                <p className="text-xs text-slate-500">From idea inception to active seed/series funding rounds</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 bg-slate-50/60 border border-slate-200">
                <span className="font-mono text-2xl font-bold text-teal-600 mb-3 block">01</span>
                <h3 className="font-bold text-slate-900 text-base mb-2">Build Your Pitch Profile</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Use our 6-step creation wizard to detail your problem statement, TAM/SAM market opportunity, unit economics, team, and funding target in INR.
                </p>
              </Card>

              <Card className="p-6 bg-slate-50/60 border border-slate-200">
                <span className="font-mono text-2xl font-bold text-teal-600 mb-3 block">02</span>
                <h3 className="font-bold text-slate-900 text-base mb-2">Upload Supporting Decks</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Share public executive summaries for open discovery, and place sensitive cap tables and audit models in your protected data room.
                </p>
              </Card>

              <Card className="p-6 bg-slate-50/60 border border-slate-200">
                <span className="font-mono text-2xl font-bold text-teal-600 mb-3 block">03</span>
                <h3 className="font-bold text-slate-900 text-base mb-2">Receive Investor Interest</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Accredited angels and VC partners express preliminary interest with introductory notes. Review investor backgrounds and accept requests.
                </p>
              </Card>

              <Card className="p-6 bg-slate-50/60 border border-slate-200">
                <span className="font-mono text-2xl font-bold text-teal-600 mb-3 block">04</span>
                <h3 className="font-bold text-slate-900 text-base mb-2">Direct Negotiation & Close</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mutual acceptance opens direct bilateral messaging, term sheet reviews, and data room permissions to close your round.
                </p>
              </Card>
            </div>
          </div>

          {/* Section: For Investors */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
              <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">For Investors & Syndicates</h2>
                <p className="text-xs text-slate-500">Discover vetted dealflow with transparent traction metrics</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 bg-slate-50/60 border border-slate-200">
                <span className="font-mono text-2xl font-bold text-[#1e3a5f] mb-3 block">01</span>
                <h3 className="font-bold text-slate-900 text-base mb-2">Define Investment Thesis</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Specify ticket sizes (₹25L to ₹50Cr), target stages (Idea, MVP, Seed, Growth), and preferred sectors across Indian tech.
                </p>
              </Card>

              <Card className="p-6 bg-slate-50/60 border border-slate-200">
                <span className="font-mono text-2xl font-bold text-[#1e3a5f] mb-3 block">02</span>
                <h3 className="font-bold text-slate-900 text-base mb-2">AI-Free Objective Match</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receive transparent rule-based compatibility scoring based purely on verified sector alignment and ticket parameters.
                </p>
              </Card>

              <Card className="p-6 bg-slate-50/60 border border-slate-200">
                <span className="font-mono text-2xl font-bold text-[#1e3a5f] mb-3 block">03</span>
                <h3 className="font-bold text-slate-900 text-base mb-2">Express Non-Binding Interest</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Signal interest without legal liabilities to request founder introductory calls and confidential data room access.
                </p>
              </Card>

              <Card className="p-6 bg-slate-50/60 border border-slate-200">
                <span className="font-mono text-2xl font-bold text-[#1e3a5f] mb-3 block">04</span>
                <h3 className="font-bold text-slate-900 text-base mb-2">Watchlist & Portfolio Sync</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track founders through your saved startups dashboard and monitor milestone updates before syndication.
                </p>
              </Card>
            </div>
          </div>

          {/* Section: For Mentors */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">For Startup Advisors & Mentors</h2>
                <p className="text-xs text-slate-500">Guide high-potential ventures with operator expertise</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-slate-50/60 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-base mb-2">Showcase Track Record</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  List your years of operator experience, unicorn exits, functional domain expertise, and industries you actively advise.
                </p>
              </Card>

              <Card className="p-6 bg-slate-50/60 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-base mb-2">Manage Mentee Bandwidth</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Set your maximum mentee capacity (e.g. 3-5 founders) and toggle availability status on/off to protect your calendar.
                </p>
              </Card>

              <Card className="p-6 bg-slate-50/60 border border-slate-200">
                <h3 className="font-bold text-slate-900 text-base mb-2">Structured Advisory Sprints</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Review incoming requests detailing specific milestones (pricing model, regulatory clearance) before accepting engagements.
                </p>
              </Card>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center p-10 rounded-3xl bg-[#1e3a5f] text-white">
            <h2 className="text-2xl sm:text-3xl font-bold">Ready to Participate in India's Venture Growth?</h2>
            <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
              Join founders, accredited angels, and startup advisors building meaningful businesses.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-teal-500 hover:bg-teal-600 text-white font-semibold">
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-white border-white/20 hover:bg-white/10">
                <Link href="/startups">Browse Opportunities</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

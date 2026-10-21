import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Target, Flag, Shield, Award, Users, HeartHandshake } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={session?.user || null} />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="teal" className="mb-3">Our Mission</Badge>
            <h1 className="text-4xl font-extrabold text-[#1e3a5f] sm:text-5xl tracking-tight">
              Democratizing Venture Capital Across India
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Idea Market was founded on a simple conviction: transformative innovation is not confined to Tier-1 metros. Every ambitious founder deserves direct, transparent access to aligned capital and experienced mentorship.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <Card className="p-8 bg-slate-50 border border-slate-200">
              <div className="p-3 rounded-xl bg-blue-100 text-[#1e3a5f] w-fit mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To build India's most credible, transparent, and accessible dealflow platform, powering 10,000+ early-stage ventures from Bengaluru to Indore.
              </p>
            </Card>

            <Card className="p-8 bg-slate-50 border border-slate-200">
              <div className="p-3 rounded-xl bg-teal-100 text-teal-800 w-fit mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Zero Fabricated Data</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We believe in genuine numbers. All investor tickets, startup metrics, and traction figures displayed represent verified user activities or seeded demo baselines.
              </p>
            </Card>

            <Card className="p-8 bg-slate-50 border border-slate-200">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 w-fit mb-4">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Operator-First Guidance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Capital without wisdom often leads to wasted runway. Our integrated mentor network pairs early founders with leaders who have built real companies.
              </p>
            </Card>
          </div>

          {/* Ecosystem Commitment */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12 mb-16">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] mb-4">
                Tailored for the Indian Economic Reality
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                Most venture platforms are clones of Western Silicon Valley models. Idea Market is designed from the ground up for Indian founders: INR native denominations (₹Lakhs and ₹Crores), regional language support readiness, GST/DPIIT compliance recognition, and deep focus on Bharat-first opportunities across Agritech, Clean Energy, and MSME enablement.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
                  <Link href="/register">Join the Community</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/startups">Explore Startups</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

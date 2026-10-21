import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { HelpCircle, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

const FAQS = [
  {
    category: 'General Platform',
    questions: [
      {
        q: 'What is Idea Market and who is it built for?',
        a: 'Idea Market is a full-stack platform built for the Indian startup ecosystem. It connects early and growth-stage entrepreneurs with accredited investors and experienced mentors.',
      },
      {
        q: 'Why is the platform priced in INR instead of USD?',
        a: 'We specifically designed Idea Market for Indian founders, Angel networks, and SEBI-registered Category I & II AIF funds. Denominations use Indian Lakhs (₹L) and Crores (₹Cr) to match domestic term sheets.',
      },
      {
        q: 'Is Idea Market free to use?',
        a: 'Creating an account, publishing startups, browsing opportunities, and expressing investment interest are completely free for all verified participants during our platform launch phase.',
      },
    ],
  },
  {
    category: 'For Entrepreneurs',
    questions: [
      {
        q: 'Can I save my startup as a draft before publishing?',
        a: 'Yes. Our 6-step creation wizard automatically saves your progress at any step. You can preview your draft privately and only publish when your materials are finalized.',
      },
      {
        q: 'How are confidential pitch decks and cap tables protected?',
        a: 'When uploading supporting documents, you can mark files as "Private". Private documents are never publicly downloadable and are only unlocked when you approve an investor request.',
      },
      {
        q: 'Can I unpublish or archive my startup later?',
        a: 'Yes. In your Entrepreneur Dashboard, you have full ownership controls to publish, unpublish, or archive your listings at any time.',
      },
    ],
  },
  {
    category: 'For Investors & Angels',
    questions: [
      {
        q: 'Does expressing interest obligate me to invest?',
        a: 'No. Expressing investment interest is an exploratory, non-binding signal that notifies the founder of your review and allows both parties to open private bilateral conversations and review data rooms.',
      },
      {
        q: 'How does the recommendation algorithm work?',
        a: 'We use transparent, rule-based compatibility scoring based on your declared industry preferences, stage criteria, and ticket sizes. We do not use black-box AI claims to fabricate recommendations.',
      },
      {
        q: 'Can I withdraw my interest request?',
        a: 'Yes. Investors can withdraw pending interest requests directly from their dashboard at any point before terms are settled.',
      },
    ],
  },
  {
    category: 'Mentorship',
    questions: [
      {
        q: 'How do mentorship engagements work?',
        a: 'Entrepreneurs submit formal requests outlining specific goals (e.g. pricing, product-market fit audits). Mentors review requests based on their stated availability and accept or decline.',
      },
      {
        q: 'Can mentors control how many mentees they take on?',
        a: 'Yes. Mentors can specify their maximum mentee capacity (e.g., 3-5 mentees) and toggle their active availability switch whenever their calendar is full.',
      },
    ],
  },
]

export default async function FAQPage() {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar user={session?.user || null} />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="blue" className="mb-3">Knowledge Base</Badge>
            <h1 className="text-4xl font-extrabold text-[#1e3a5f] tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-base text-slate-600">
              Clear answers regarding our workflows, security standards, and platform policies.
            </p>
          </div>

          <div className="space-y-12">
            {FAQS.map(group => (
              <div key={group.category}>
                <h2 className="text-xl font-bold text-[#1e3a5f] mb-4 pb-2 border-b border-slate-200">
                  {group.category}
                </h2>
                <div className="space-y-4">
                  {group.questions.map((faq, i) => (
                    <Card key={i} className="p-6 bg-white border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-900 text-base mb-2">{faq.q}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-2xl bg-white border border-slate-200 text-center">
            <h3 className="text-lg font-bold text-slate-900">Have a specific question not covered here?</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">Our support and compliance team is available to assist you.</p>
            <Button asChild className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

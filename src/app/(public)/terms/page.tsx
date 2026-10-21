import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export const dynamic = 'force-dynamic'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={null} />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 prose prose-slate">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500">Last updated: October 2026</p>

          <section className="mt-8 space-y-6 text-sm text-slate-700 leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900">1. Nature of Platform & Non-Brokerage Status</h2>
            <p>
              Idea Market is a technology platform designed to facilitate introductory connections and information exchange between entrepreneurs, investors, and mentors.
            </p>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-medium">
              Important Disclaimer: Idea Market is not a registered broker-dealer, funding portal, or investment adviser under SEBI regulations. The platform does not solicit investments, process equity transactions, or custody funds.
            </div>

            <h2 className="text-xl font-bold text-slate-900">2. Expressions of Investment Interest</h2>
            <p>
              Any expression of investment interest submitted on the platform represents an exploratory indicator of preliminary interest only. Expressing interest does not constitute an offer, sale, or legally binding obligation to invest or enter into contracts. All financial terms and due diligence are executed independently between the respective parties.
            </p>

            <h2 className="text-xl font-bold text-slate-900">3. User Representation & Truth in Pitching</h2>
            <p>
              Founders warrant that all business metrics, revenue figures, cap-table representations, and intellectual property claims published on Idea Market are accurate and free from fraudulent misrepresentation. Fabrication of financial data constitutes grounds for immediate account suspension.
            </p>

            <h2 className="text-xl font-bold text-slate-900">4. Code of Conduct & Account Termination</h2>
            <p>
              Users agree to maintain professional etiquette across messaging and mentorship requests. Spamming founders, circumventing platform moderation, or harassing participants will result in immediate termination of account access and logging in our administrative audit records.
            </p>

            <h2 className="text-xl font-bold text-slate-900">5. Governing Law & Jurisdiction</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

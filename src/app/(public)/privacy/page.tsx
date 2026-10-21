import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export const dynamic = 'force-dynamic'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={null} />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 prose prose-slate">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">Last updated: October 2026</p>

          <section className="mt-8 space-y-6 text-sm text-slate-700 leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              Idea Market collects information required to facilitate authentic venture connections across entrepreneurs, accredited investors, and mentors:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Credentials:</strong> Full name, verified email address, hashed passwords, and contact numbers.</li>
              <li><strong>Profile Information:</strong> Professional biographies, LinkedIn profiles, organizational designations, and past startup experience.</li>
              <li><strong>Startup Data:</strong> Pitch decks, market problem/solution overviews, operational metrics, and confidential data room files.</li>
              <li><strong>Investment Criteria:</strong> Declared ticket ranges, sector interests, and stage preferences for investors.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900">2. Confidentiality of Private Documents</h2>
            <p>
              Documents marked as "Private" in an entrepreneur's startup listing (such as detailed financial models or capitalization tables) are protected by server-side authorization controls and are never indexed by search engines or shared publicly. They are disclosed exclusively upon bilateral founder consent.
            </p>

            <h2 className="text-xl font-bold text-slate-900">3. Non-Sale of Personal Data</h2>
            <p>
              We do not sell, rent, or monetize your contact or financial information to third-party ad networks or brokers. Your contact details are shared with other registered users only when you accept a connection request or respond to an investment interest.
            </p>

            <h2 className="text-xl font-bold text-slate-900">4. Data Security & Storage</h2>
            <p>
              All traffic is encrypted in transit using industry-standard TLS. Passwords are encrypted with salted bcrypt hashing. Sensitive endpoints implement strict rate-limiting and authorization checks.
            </p>

            <h2 className="text-xl font-bold text-slate-900">5. Contact Our Privacy Officer</h2>
            <p>
              For inquiries regarding data retention, account deletion, or compliance with the Digital Personal Data Protection Act (DPDP), contact us at <a href="mailto:privacy@ideamarket.in" className="text-[#1e3a5f] underline">privacy@ideamarket.in</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

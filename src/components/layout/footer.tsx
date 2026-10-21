import Link from 'next/link'
import { Lightbulb } from 'lucide-react'

const footerLinks = {
  platform: [
    { href: '/startups', label: 'Explore Startups' },
    { href: '/investors', label: 'Investors' },
    { href: '/mentors', label: 'Mentors' },
    { href: '/how-it-works', label: 'How It Works' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#1e3a5f]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a5f]">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
              </div>
              Idea Market
            </Link>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Connecting entrepreneurs, investors, and mentors to build the next generation of Indian startups.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Idea Market. All rights reserved. Built for the Indian startup ecosystem.
          </p>
          <p className="text-xs text-slate-400">
            Platform activity reflects real user data only. Demo accounts are clearly marked.
          </p>
        </div>
      </div>
    </footer>
  )
}

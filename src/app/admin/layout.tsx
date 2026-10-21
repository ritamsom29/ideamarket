import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Users,
  Lightbulb,
  FileText,
  LayoutDashboard,
  ArrowLeft,
  BarChart2,
  Flag,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Admin Sidebar */}
      <aside className="w-64 min-h-screen bg-[#0f2848] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide">IDEA MARKET</h2>
              <span className="text-[10px] text-teal-300 font-semibold uppercase">Admin Console</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-sm font-medium">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" /> Overview
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 transition-colors"
          >
            <Users className="h-4 w-4" /> User Management
          </Link>
          <Link
            href="/admin/startups"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 transition-colors"
          >
            <Lightbulb className="h-4 w-4" /> Startup Moderation
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 transition-colors"
          >
            <BarChart2 className="h-4 w-4" /> Analytics
          </Link>
          <Link
            href="/admin/reports"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 transition-colors"
          >
            <Flag className="h-4 w-4" /> Reports
          </Link>
          <Link
            href="/admin/audit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/10 transition-colors"
          >
            <FileText className="h-4 w-4" /> Audit Logs
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button variant="ghost" size="sm" asChild className="w-full justify-start text-xs text-slate-300 hover:text-white hover:bg-white/10">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Exit to App
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Lightbulb,
  Users,
  MessageSquare,
  Bell,
  Settings,
  User,
  BookOpen,
  Search,
  Heart,
  TrendingUp,
  GraduationCap,
  Shield,
  FileText,
  BarChart2,
  Flag,
} from 'lucide-react'

type UserRole = 'ENTREPRENEUR' | 'INVESTOR' | 'MENTOR' | 'ADMIN'

interface SidebarLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const commonLinks: SidebarLink[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/connections', label: 'Connections', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const roleLinks: Record<UserRole, SidebarLink[]> = {
  ENTREPRENEUR: [
    { href: '/dashboard/startups', label: 'My Startups', icon: Lightbulb },
    { href: '/dashboard/startups/new', label: 'Create Startup', icon: TrendingUp },
    { href: '/dashboard/interests', label: 'Investor Interests', icon: Heart },
    { href: '/dashboard/mentorship', label: 'Mentorship', icon: GraduationCap },
  ],
  INVESTOR: [
    { href: '/startups', label: 'Discover Startups', icon: Search },
    { href: '/dashboard/saved', label: 'Saved Startups', icon: Heart },
    { href: '/dashboard/interests', label: 'My Interests', icon: TrendingUp },
  ],
  MENTOR: [
    { href: '/dashboard/mentorship-requests', label: 'Mentorship Requests', icon: BookOpen },
    { href: '/dashboard/mentees', label: 'My Mentees', icon: Users },
  ],
  ADMIN: [
    { href: '/admin', label: 'Admin Dashboard', icon: Shield },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/startups', label: 'Startup Moderation', icon: Lightbulb },
    { href: '/admin/reports', label: 'Reports', icon: Flag },
    { href: '/admin/audit', label: 'Audit Logs', icon: FileText },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  ],
}

interface DashboardSidebarProps {
  role: UserRole
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname()
  const links = role === 'ADMIN' ? roleLinks.ADMIN : [...(roleLinks[role] || []), ...commonLinks]

  return (
    <aside className="w-64 min-h-screen border-r border-border bg-white flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-[#1e3a5f]">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1e3a5f]">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
          </div>
          Idea Market
        </Link>
      </div>
      <nav className="flex-1 px-4 pb-4 space-y-1">
        {links.map(link => {
          const Icon = link.icon
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#1e3a5f]'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import { toggleUserStatus } from '@/actions/admin'
import { DEMO_USERS_LIST } from '@/lib/demo-data'
import { Search, UserX, UserCheck, Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    search?: string
    role?: string
  }>
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search || ''
  const role = params.role || ''

  let users: any[] = []
  try {
    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (role) {
      where.role = role
    }

    users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  } catch (error) {
    console.warn('DB error on AdminUsersPage, using demo registry:', error)
  }

  if (users.length === 0) {
    let fallback = [...DEMO_USERS_LIST]
    if (search) {
      const q = search.toLowerCase()
      fallback = fallback.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    }
    if (role) {
      fallback = fallback.filter(u => u.role === role)
    }
    users = fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Inspect registered platform users, verify account roles, and enforce moderation suspensions.
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white border border-slate-200">
        <form method="GET" action="/admin/users" className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              name="search"
              defaultValue={search}
              placeholder="Search user by name or email..."
              className="pl-9"
            />
          </div>

          <select
            name="role"
            defaultValue={role}
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="ENTREPRENEUR">Entrepreneur</option>
            <option value="INVESTOR">Investor</option>
            <option value="MENTOR">Mentor</option>
            <option value="ADMIN">Administrator</option>
          </select>

          <Button type="submit" size="sm" className="bg-[#0f2848] text-white">
            Search
          </Button>
        </form>
      </Card>

      {/* User Table */}
      <Card className="bg-white border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 text-sm">{u.name || 'Anonymous'}</p>
                    <p className="text-slate-500">{u.email}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {u.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] bg-red-50 text-red-700 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500">{formatDate(u.createdAt)}</td>
                  <td className="p-4 text-right">
                    {u.role !== 'ADMIN' && (
                      <form
                        action={async () => {
                          'use server'
                          await toggleUserStatus(
                            u.id,
                            u.isActive,
                            u.isActive ? 'Admin suspension' : 'Reactivated by admin'
                          )
                        }}
                      >
                        {u.isActive ? (
                          <Button size="sm" variant="outline" type="submit" className="text-red-600 border-red-200 hover:bg-red-50 text-xs">
                            <UserX className="h-3 w-3 mr-1" /> Suspend
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" type="submit" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs">
                            <UserCheck className="h-3 w-3 mr-1" /> Reactivate
                          </Button>
                        )}
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

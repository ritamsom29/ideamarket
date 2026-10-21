import prisma from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { FileText, Shield } from 'lucide-react'
import { DEMO_AUDIT_LOGS } from '@/lib/demo-data'

export const dynamic = 'force-dynamic'

export default async function AdminAuditLogsPage() {
  let logs: any[] = []
  try {
    logs = await prisma.auditLog.findMany({
      include: { admin: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
  } catch (error) {
    console.warn('DB error on AdminAuditLogsPage, using demo audit logs:', error)
  }

  if (logs.length === 0) {
    logs = DEMO_AUDIT_LOGS as any
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Administrative Audit Logs
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Immutable historical trail of all administrative interventions, moderation approvals, and user suspensions.
        </p>
      </div>

      <Card className="bg-white border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-4">Action</th>
                <th className="p-4">Description</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Admin Performer</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono">
                    <Badge variant="outline" className="text-[10px]">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="p-4 font-medium text-slate-900 max-w-md">
                    {log.description}
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-[11px]">
                    {log.targetType ? `${log.targetType} (${log.targetId?.slice(0, 8)}...)` : 'System'}
                  </td>
                  <td className="p-4 text-slate-700">
                    {log.admin?.name || log.admin?.email || log.adminId}
                  </td>
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    {formatDate(log.createdAt)}
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

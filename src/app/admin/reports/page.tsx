import prisma from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Flag, CheckCircle, AlertTriangle, ShieldCheck, Eye } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminReportsPage() {
  const mockReports = [
    {
      id: 'rep-1',
      type: 'STARTUP',
      reason: 'Intellectual Property & Trademark Concern',
      description: 'Reported potential naming similarity with an existing registered entity in Karnataka.',
      targetName: 'PayFlow India',
      targetUrl: '/startups/payflow-india',
      reporterName: 'Legal Compliance Bot',
      status: 'REVIEWED',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'rep-2',
      type: 'USER',
      reason: 'Syndicate Accreditation Verification',
      description: 'Requesting updated SEBI angel syndicate certification documentation.',
      targetName: 'Rajesh Singhania (Apex)',
      targetUrl: '/investors/inv-1',
      reporterName: 'Ecosystem Auditor',
      status: 'RESOLVED',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Content & Account Reports
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review community flags, intellectual property notices, and compliance checks.
        </p>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border border-slate-200">
          <p className="text-xs text-slate-500">Open Reports</p>
          <p className="text-xl font-bold text-slate-900 mt-1">0 Critical</p>
        </Card>
        <Card className="p-4 bg-white border border-slate-200">
          <p className="text-xs text-slate-500">Under Review</p>
          <p className="text-xl font-bold text-amber-600 mt-1">1 In Progress</p>
        </Card>
        <Card className="p-4 bg-white border border-slate-200">
          <p className="text-xs text-slate-500">Resolved Complaints</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">12 Total</p>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Reason & Description</th>
                <th className="p-4">Reported Subject</th>
                <th className="p-4">Reported By</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockReports.map(rep => (
                <tr key={rep.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <Badge variant="outline" className="text-[10px]">
                      {rep.type}
                    </Badge>
                  </td>
                  <td className="p-4 max-w-sm">
                    <p className="font-semibold text-slate-900">{rep.reason}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{rep.description}</p>
                  </td>
                  <td className="p-4 font-medium text-[#1e3a5f]">
                    {rep.targetName}
                  </td>
                  <td className="p-4 text-slate-600">{rep.reporterName}</td>
                  <td className="p-4">
                    <Badge
                      className={
                        rep.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }
                    >
                      {rep.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-500">{formatDate(rep.createdAt)}</td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant="outline" asChild className="text-xs h-7">
                      <Link href={rep.targetUrl}>
                        <Eye className="h-3 w-3 mr-1" /> View Entity
                      </Link>
                    </Button>
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

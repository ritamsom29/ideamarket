import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnalyticsCharts } from '@/components/admin/analytics-charts'
import { TrendingUp, IndianRupee, Users, Activity, ArrowUpRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminAnalyticsPage() {
  const kpis = [
    {
      title: 'Total Capital Sought',
      value: '₹6.25 Cr',
      change: '+18.4% this month',
      icon: IndianRupee,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Active Deal Interactions',
      value: '42',
      change: '+32% MoM velocity',
      icon: TrendingUp,
      color: 'text-teal-600 bg-teal-50',
    },
    {
      title: 'Accredited Investors',
      value: '16',
      change: '100% verified syndicates',
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Term Sheet Conversion',
      value: '28.5%',
      change: 'Industry benchmark: 14%',
      icon: Activity,
      color: 'text-purple-600 bg-purple-50',
    },
  ]

  const topSectors = [
    {
      sector: 'Fintech & Payments',
      startups: 3,
      avgTicket: '₹75 Lakhs',
      inquiries: 18,
      heat: 'High Demand',
    },
    {
      sector: 'Clean Energy & Climate',
      startups: 2,
      avgTicket: '₹1.2 Crores',
      inquiries: 12,
      heat: 'Surging',
    },
    {
      sector: 'Agritech',
      startups: 2,
      avgTicket: '₹50 Lakhs',
      inquiries: 9,
      heat: 'Steady',
    },
    {
      sector: 'Healthtech & Medtech',
      startups: 1,
      avgTicket: '₹85 Lakhs',
      inquiries: 7,
      heat: 'Emerging',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Platform Ecosystem Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time metrics on deal velocity, capital flow trends, and startup sector distributions across India.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card key={idx} className="bg-white border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{kpi.title}</span>
                <div className={`p-2 rounded-lg ${kpi.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  {kpi.change}
                </p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Interactive Charts */}
      <AnalyticsCharts />

      {/* Top Performing Sectors Table */}
      <Card className="bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Sector Deal Flow Ranking</h2>
          <p className="text-xs text-slate-500">
            Categorized breakdown of current venture traction and investor engagement levels
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="p-4">Sector</th>
                <th className="p-4">Active Startups</th>
                <th className="p-4">Avg. Ticket Size</th>
                <th className="p-4">Total Inquiries</th>
                <th className="p-4">Investor Sentiment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topSectors.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900">{s.sector}</td>
                  <td className="p-4 text-slate-600">{s.startups} ventures</td>
                  <td className="p-4 text-slate-900 font-semibold">{s.avgTicket}</td>
                  <td className="p-4 font-mono text-teal-700 font-bold">{s.inquiries}</td>
                  <td className="p-4">
                    <Badge
                      className={
                        s.heat === 'High Demand'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : s.heat === 'Surging'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }
                    >
                      {s.heat}
                    </Badge>
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

'use client'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const monthlyActivity = [
  { month: 'May', startups: 1, investors: 2, interests: 4 },
  { month: 'Jun', startups: 2, investors: 3, interests: 7 },
  { month: 'Jul', startups: 3, investors: 5, interests: 11 },
  { month: 'Aug', startups: 4, investors: 8, interests: 18 },
  { month: 'Sep', startups: 6, investors: 12, interests: 26 },
  { month: 'Oct', startups: 8, investors: 16, interests: 38 },
]

const sectorDistribution = [
  { name: 'Fintech & Payments', value: 35, color: '#1e3a5f' },
  { name: 'Clean Energy & Climate', value: 25, color: '#0d9488' },
  { name: 'Agritech', value: 20, color: '#059669' },
  { name: 'Healthtech & Medtech', value: 15, color: '#3b82f6' },
  { name: 'SaaS & Enterprise', value: 5, color: '#8b5cf6' },
]

const stageBreakdown = [
  { stage: 'Idea Stage', count: 3, funding: 15 },
  { stage: 'MVP', count: 4, funding: 35 },
  { stage: 'Early Stage', count: 6, funding: 120 },
  { stage: 'Growth', count: 2, funding: 250 },
]

export function AnalyticsCharts() {
  return (
    <div className="space-y-6">
      {/* 2-Column Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Trends */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              Ecosystem Growth & Deal Inquiries
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Monthly new startup listings vs investor expressions of interest
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="startupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="interests"
                  name="Investor Interests"
                  stroke="#0d9488"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#interestGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="startups"
                  name="Startups Onboarded"
                  stroke="#1e3a5f"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#startupGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sector Allocation */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              Capital Distribution by Sector (%)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Share of total investment interest across key Indian startup sectors
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sectorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Share']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stage Breakdown Bar Chart */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">
            Maturity Stage Capital Demand (₹ Lakhs)
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Total average capital sought by development stage
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="stage" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                formatter={(val: any) => [`₹${val} Lakhs`, 'Target Funding']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="funding" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

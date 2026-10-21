import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { ShieldCheck, Mail, MapPin, Building2, Award } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await auth()
  const userId = session?.user?.id
  const role = session?.user?.role || 'ENTREPRENEUR'

  let dbUser = null
  if (userId && !userId.startsWith('usr-')) {
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          entrepreneurProfile: true,
          investorProfile: true,
          mentorProfile: true,
        },
      })
    } catch (e) {
      console.warn('Prisma lookup failed in profile, using session/demo fallback')
    }
  }

  const name = dbUser?.name || session?.user?.name || 'User'
  const email = dbUser?.email || session?.user?.email || 'user@ideamarket.in'
  const image = dbUser?.image || session?.user?.image || ''

  // Fallbacks for profile details
  const entrepreneurBio =
    dbUser?.entrepreneurProfile?.bio ||
    'Serial entrepreneur with 8+ years of product leadership in building high-throughput payment architectures and digital MSME credit workflows in India.'
  const entrepreneurLocation = dbUser?.entrepreneurProfile?.location || 'Bengaluru, Karnataka'
  const entrepreneurYears = dbUser?.entrepreneurProfile?.yearsExperience ?? 8
  const entrepreneurStartups = dbUser?.entrepreneurProfile?.previousStartups ?? 1

  const investorOrg = dbUser?.investorProfile?.organization || 'Apex Ventures India'
  const investorDesignation = dbUser?.investorProfile?.designation || 'Managing Partner'
  const investorThesis =
    dbUser?.investorProfile?.investmentThesis ||
    'Backing exceptional founders building scalable fintech, B2B SaaS, and climate-tech solutions across Tier 1 and Tier 2 India.'

  const mentorHeadline =
    dbUser?.mentorProfile?.headline || 'Ex-VP Product at ScaleAdvisors | Product Strategy & Growth Mentor'
  const mentorBio =
    dbUser?.mentorProfile?.bio ||
    'Over 15+ years of operational experience scaling product management, enterprise pricing, and B2B go-to-market strategies.'
  const mentorFocus =
    dbUser?.mentorProfile?.mentorshipFocus ||
    'Product Market Fit (PMF), Go-To-Market strategies, and enterprise pricing.'

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
          User Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your verified identity and public ecosystem credentials.
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card className="bg-white border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-slate-200">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback className="bg-[#1e3a5f] text-white text-lg">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{name}</h2>
                <Badge className="bg-teal-50 text-teal-800 border-teal-200 capitalize">
                  {role.toLowerCase()}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-medium">
            <ShieldCheck className="h-4 w-4" /> Account Verified
          </div>
        </div>

        {/* Role-Specific Profile Details */}
        <div className="pt-6 space-y-6">
          {role === 'ENTREPRENEUR' && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-slate-500">Founder Biography</Label>
                <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                  {entrepreneurBio}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Location</span>
                  <span className="font-semibold text-slate-800">{entrepreneurLocation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Years Experience</span>
                  <span className="font-semibold text-slate-800">{entrepreneurYears} Years</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Startups Founded</span>
                  <span className="font-semibold text-slate-800">{entrepreneurStartups}</span>
                </div>
              </div>
            </div>
          )}

          {role === 'INVESTOR' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-500">Organization / Syndicate</Label>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{investorOrg}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Designation</Label>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{investorDesignation}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-slate-500">Investment Thesis</Label>
                <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                  {investorThesis}
                </p>
              </div>
            </div>
          )}

          {role === 'MENTOR' && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-slate-500">Professional Headline</Label>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{mentorHeadline}</p>
              </div>

              <div>
                <Label className="text-xs text-slate-500">Executive Bio</Label>
                <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                  {mentorBio}
                </p>
              </div>

              <div>
                <Label className="text-xs text-slate-500">Mentorship Focus</Label>
                <p className="text-sm text-teal-800 mt-1 font-medium">
                  {mentorFocus}
                </p>
              </div>
            </div>
          )}

          {role === 'ADMIN' && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-slate-500">Administrative Privilege</Label>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">Platform Super Administrator</p>
              </div>

              <div>
                <Label className="text-xs text-slate-500">Role Permissions</Label>
                <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                  Full ecosystem oversight: startup moderation, user status management, content dispute resolution, and security audit log analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

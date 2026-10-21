import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { getMentorById } from '@/lib/services/mentors'
import { RequestMentorshipModal } from '@/components/mentors/request-mentorship-modal'
import { GraduationCap, MapPin, Award, CheckCircle2, ArrowLeft, Briefcase } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function MentorDetailPage({ params }: Props) {
  const session = await auth()
  const { id } = await params

  const mentor = await getMentorById(id)
  if (!mentor) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar user={session?.user || null} />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/mentors">
              <ArrowLeft className="h-4 w-4" /> Back to Mentor Directory
            </Link>
          </Button>

          {/* Header Card */}
          <Card className="p-8 bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-5">
                <img
                  src={mentor.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                  alt={mentor.name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">{mentor.name}</h1>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold">
                      {mentor.yearsExperience}+ Years Experience
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">{mentor.headline}</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {mentor.location}
                  </p>
                </div>
              </div>

              <RequestMentorshipModal
                mentorUserId={mentor.userId}
                mentorName={mentor.name}
                isLoggedIn={!!session?.user}
                isAvailable={mentor.isAvailable}
              />
            </div>

            {/* Biography & Focus */}
            <div className="pt-6 space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Executive Operator Bio</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{mentor.bio}</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-emerald-600" /> Mentorship & Advisory Focus
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {mentor.mentorshipFocus}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-3">Core Functional Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertiseAreas?.map((exp: string) => (
                    <span
                      key={exp}
                      className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 font-medium border border-emerald-100"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-3">Supported Industry Verticals</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.supportedIndustries?.map((ind: any) => (
                    <span
                      key={ind.id}
                      className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-medium"
                    >
                      {ind.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

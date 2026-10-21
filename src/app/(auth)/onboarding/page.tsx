import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { completeOnboarding } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, TrendingUp, GraduationCap, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.onboardingCompleted) {
    redirect('/dashboard')
  }

  const role = session.user.role

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <Card className="border border-slate-200/80 shadow-md bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-800">
                {role === 'ENTREPRENEUR' && <Lightbulb className="h-6 w-6" />}
                {role === 'INVESTOR' && <TrendingUp className="h-6 w-6" />}
                {role === 'MENTOR' && <GraduationCap className="h-6 w-6" />}
              </div>
              <div>
                <CardTitle className="text-xl">
                  {role === 'ENTREPRENEUR' && 'Complete Entrepreneur Profile'}
                  {role === 'INVESTOR' && 'Configure Investment Preferences'}
                  {role === 'MENTOR' && 'Establish Mentor Advisory Profile'}
                </CardTitle>
                <CardDescription className="text-xs">
                  Provide verified ecosystem information to personalize your matchmaking experience.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <form action={async (formData: FormData) => {
            'use server'
            await completeOnboarding(formData)
          }}>
            <CardContent className="space-y-6 pt-6">
              {/* Entrepreneur Onboarding Fields */}
              {role === 'ENTREPRENEUR' && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="bio">Professional Background & Founder Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      required
                      placeholder="Briefly describe your domain experience, technical background, and past accomplishments..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="location">Operating Location / City</Label>
                      <Input id="location" name="location" required placeholder="e.g. Bengaluru, Karnataka" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Contact Number</Label>
                      <Input id="phone" name="phone" placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="yearsExperience">Years of Professional Experience</Label>
                      <Input id="yearsExperience" name="yearsExperience" type="number" defaultValue="5" min="0" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="previousStartups">Previous Startups Founded</Label>
                      <Input id="previousStartups" name="previousStartups" type="number" defaultValue="0" min="0" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                    <Input id="linkedinUrl" name="linkedinUrl" placeholder="https://linkedin.com/in/username" />
                  </div>
                </>
              )}

              {/* Investor Onboarding Fields */}
              {role === 'INVESTOR' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="organization">Fund / Syndicate / Angel Network</Label>
                      <Input id="organization" name="organization" required placeholder="e.g. Apex India Capital or Independent Angel" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="designation">Designation / Role</Label>
                      <Input id="designation" name="designation" required placeholder="e.g. General Partner or Angel Investor" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="minInvestmentINR">Minimum Ticket Size (INR)</Label>
                      <Input id="minInvestmentINR" name="minInvestmentINR" type="number" defaultValue="1000000" step="500000" />
                      <p className="text-[10px] text-slate-400">e.g. ₹10 Lakhs</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="maxInvestmentINR">Maximum Ticket Size (INR)</Label>
                      <Input id="maxInvestmentINR" name="maxInvestmentINR" type="number" defaultValue="25000000" step="1000000" />
                      <p className="text-[10px] text-slate-400">e.g. ₹2.5 Crores</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="investmentThesis">Investment Thesis & Criteria</Label>
                    <Textarea
                      id="investmentThesis"
                      name="investmentThesis"
                      required
                      placeholder="Outline what you look for in founding teams, business models, gross unit margins, and market opportunity..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="location">Operating City</Label>
                      <Input id="location" name="location" required placeholder="e.g. Mumbai, Maharashtra" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="linkedinUrl">LinkedIn / Portfolio URL</Label>
                      <Input id="linkedinUrl" name="linkedinUrl" placeholder="https://linkedin.com/in/username" />
                    </div>
                  </div>
                </>
              )}

              {/* Mentor Onboarding Fields */}
              {role === 'MENTOR' && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="headline">Professional Headline</Label>
                    <Input id="headline" name="headline" required placeholder="e.g. Ex-VP Product at Unicorn E-commerce | Startup Advisor" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="bio">Executive Bio & Track Record</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      required
                      placeholder="Detail your past leadership roles, scaled initiatives, and company building experience..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="yearsExperience">Years of Industry Experience</Label>
                      <Input id="yearsExperience" name="yearsExperience" type="number" defaultValue="12" min="1" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" required placeholder="e.g. Gurugram, Haryana" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="mentorshipFocus">Areas of Mentorship Focus</Label>
                    <Input id="mentorshipFocus" name="mentorshipFocus" required placeholder="e.g. Product-Market Fit, Regulatory CDSCO clearance, GTM" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                    <Input id="linkedinUrl" name="linkedinUrl" placeholder="https://linkedin.com/in/username" />
                  </div>
                </>
              )}

              <Button type="submit" size="lg" className="w-full bg-[#1e3a5f] hover:bg-[#0f2848] text-white font-semibold">
                Complete Onboarding & Enter Dashboard
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}

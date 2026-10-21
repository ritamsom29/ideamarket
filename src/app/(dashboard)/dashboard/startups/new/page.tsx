'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { createStartup } from '@/actions/startups'
import { DEMO_INDUSTRIES } from '@/lib/demo-data'
import { STARTUP_STAGES, FUNDING_TYPES, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  FileCheck,
  Building2,
  TrendingUp,
  Users,
  IndianRupee,
} from 'lucide-react'

const STEPS = [
  { step: 1, title: 'Basic Information' },
  { step: 2, title: 'Problem & Solution' },
  { step: 3, title: 'Market & Model' },
  { step: 4, title: 'Team & Traction' },
  { step: 5, title: 'Funding Target' },
  { step: 6, title: 'Review & Publish' },
]

export default function NewStartupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Wizard state
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    location: '',
    websiteUrl: '',
    industryId: '',
    stage: 'IDEA',
    problemStatement: '',
    solutionDescription: '',
    productDescription: '',
    marketOpportunity: '',
    businessModel: '',
    competitiveAdvantage: '',
    targetCustomers: '',
    traction: '',
    teamSize: '1',
    fundingType: 'SEED',
    fundingGoalINR: '',
    equityOffered: '',
    useOfFunds: '',
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.tagline.trim() || !formData.description.trim()) {
        toast.error('Please complete all basic information fields.')
        return
      }
    }
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async (publishImmediately: boolean) => {
    setLoading(true)
    try {
      const payload = {
        ...formData,
        fundingGoalINR: formData.fundingGoalINR ? Number(formData.fundingGoalINR) : null,
        equityOffered: formData.equityOffered ? Number(formData.equityOffered) : null,
        teamSize: Number(formData.teamSize) || 1,
      }

      const res = await createStartup(payload, publishImmediately)
      if (res.success) {
        toast.success(
          publishImmediately
            ? 'Startup published to public discovery!'
            : 'Startup draft saved successfully.'
        )
        router.push(publishImmediately ? `/startups/${res.slug}` : '/dashboard/startups')
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to save startup.')
      }
    } catch {
      toast.error('Network error during save.')
    } finally {
      setLoading(false)
    }
  }

  const progressPercent = Math.round((currentStep / 6) * 100)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Wizard Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
          Create New Startup
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Follow the 6-step guided wizard to showcase your business to Indian venture capital partners.
        </p>

        {/* Step Indicators */}
        <div className="mt-6">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
            <span>Step {currentStep} of 6: {STEPS[currentStep - 1].title}</span>
            <span className="text-teal-700">{progressPercent}% Completed</span>
          </div>
          <Progress value={progressPercent} className="h-2" />

          <div className="hidden sm:grid grid-cols-6 gap-2 mt-3">
            {STEPS.map(s => (
              <div
                key={s.step}
                className={`text-[11px] font-medium pb-1 border-b-2 text-center transition-colors ${
                  s.step === currentStep
                    ? 'border-[#1e3a5f] text-[#1e3a5f] font-bold'
                    : s.step < currentStep
                    ? 'border-emerald-500 text-emerald-700'
                    : 'border-slate-200 text-slate-400'
                }`}
              >
                {s.title}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Form Container */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardContent className="pt-8 space-y-6">
          {/* STEP 1: BASIC INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Startup Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="e.g., PayFlow India, GreenGrid Mobility"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tagline">One-line Tagline / Elevator Hook *</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={e => updateField('tagline', e.target.value)}
                  placeholder="e.g., Instant working capital & micro-reconciliation for MSME merchants"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="industryId">Primary Industry Sector *</Label>
                  <select
                    id="industryId"
                    value={formData.industryId}
                    onChange={e => updateField('industryId', e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  >
                    <option value="">Select industry</option>
                    {DEMO_INDUSTRIES.map(ind => (
                      <option key={ind.id} value={ind.id}>
                        {ind.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="stage">Current Development Stage *</Label>
                  <select
                    id="stage"
                    value={formData.stage}
                    onChange={e => updateField('stage', e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  >
                    {STARTUP_STAGES.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="location">Headquarters Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={e => updateField('location', e.target.value)}
                    placeholder="e.g., Bengaluru, Karnataka"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={e => updateField('websiteUrl', e.target.value)}
                    placeholder="https://yourstartup.in"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Executive Summary / Overview *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => updateField('description', e.target.value)}
                  placeholder="Provide an overview of your startup vision, who you are building for, and key accomplishments to date..."
                  rows={4}
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2: PROBLEM & SOLUTION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="problemStatement">The Problem Statement *</Label>
                <Textarea
                  id="problemStatement"
                  value={formData.problemStatement}
                  onChange={e => updateField('problemStatement', e.target.value)}
                  placeholder="What friction, inefficiency, or structural pain point exists in the market today? Detail who suffers and what the economic cost is..."
                  rows={4}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="solutionDescription">Your Proposed Solution *</Label>
                <Textarea
                  id="solutionDescription"
                  value={formData.solutionDescription}
                  onChange={e => updateField('solutionDescription', e.target.value)}
                  placeholder="How does your product solve this problem dramatically better, cheaper, or faster than status quo alternatives?..."
                  rows={4}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="targetCustomers">Target Customer Segment</Label>
                <Input
                  id="targetCustomers"
                  value={formData.targetCustomers}
                  onChange={e => updateField('targetCustomers', e.target.value)}
                  placeholder="e.g., Tier-2 retail merchants, EV 2-wheeler gig workers, district hospitals..."
                />
              </div>
            </div>
          )}

          {/* STEP 3: MARKET & BUSINESS MODEL */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="marketOpportunity">Market Sizing & Opportunity</Label>
                <Textarea
                  id="marketOpportunity"
                  value={formData.marketOpportunity}
                  onChange={e => updateField('marketOpportunity', e.target.value)}
                  placeholder="Detail your TAM, SAM, SOM market estimates and macro growth drivers supporting your timing..."
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="businessModel">Business Model & Monetization</Label>
                <Textarea
                  id="businessModel"
                  value={formData.businessModel}
                  onChange={e => updateField('businessModel', e.target.value)}
                  placeholder="How does the business make money? (e.g. SaaS subscription, transaction take-rate, marketplace commission)..."
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="competitiveAdvantage">Competitive Advantage (Moat)</Label>
                <Textarea
                  id="competitiveAdvantage"
                  value={formData.competitiveAdvantage}
                  onChange={e => updateField('competitiveAdvantage', e.target.value)}
                  placeholder="What makes your solution defensible against competitors? (IP, regulatory clearances, proprietary data, distribution)..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* STEP 4: TEAM & TRACTION */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="productDescription">Product Architecture & Core Features</Label>
                <Textarea
                  id="productDescription"
                  value={formData.productDescription}
                  onChange={e => updateField('productDescription', e.target.value)}
                  placeholder="Describe your current tech stack, operational workflow, or hardware components..."
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="traction">Current Traction & Key Metrics</Label>
                <Textarea
                  id="traction"
                  value={formData.traction}
                  onChange={e => updateField('traction', e.target.value)}
                  placeholder="e.g. Monthly active users, gross transaction volume, signed pilot contracts, MoM growth rate..."
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="teamSize">Current Core Team Size</Label>
                <Input
                  id="teamSize"
                  type="number"
                  min="1"
                  value={formData.teamSize}
                  onChange={e => updateField('teamSize', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 5: FUNDING REQUIREMENTS */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="fundingType">Investment Round Structure</Label>
                  <select
                    id="fundingType"
                    value={formData.fundingType}
                    onChange={e => updateField('fundingType', e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                  >
                    {FUNDING_TYPES.map(ft => (
                      <option key={ft.value} value={ft.value}>
                        {ft.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="fundingGoalINR">Funding Target in INR (₹)</Label>
                  <Input
                    id="fundingGoalINR"
                    type="number"
                    step="500000"
                    placeholder="e.g., 25000000 for ₹2.5 Crore"
                    value={formData.fundingGoalINR}
                    onChange={e => updateField('fundingGoalINR', e.target.value)}
                  />
                  {formData.fundingGoalINR && (
                    <p className="text-xs font-semibold text-teal-700">
                      Formatted: {formatCurrency(Number(formData.fundingGoalINR))}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="equityOffered">Equity Offered (%) (Optional)</Label>
                <Input
                  id="equityOffered"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g., 8.5 for 8.5%"
                  value={formData.equityOffered}
                  onChange={e => updateField('equityOffered', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="useOfFunds">Planned Use of Capital</Label>
                <Textarea
                  id="useOfFunds"
                  value={formData.useOfFunds}
                  onChange={e => updateField('useOfFunds', e.target.value)}
                  placeholder="e.g. 40% Engineering & UPI tech, 35% Merchant acquisition across 12 cities, 25% Regulatory reserve..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & PUBLISH */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{formData.name || 'Startup Listing'}</h3>
                <p className="text-xs text-slate-500 mb-4">{formData.tagline}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block">Stage</span>
                    <span className="font-semibold text-slate-800">{formData.stage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Funding Target</span>
                    <span className="font-bold text-[#1e3a5f]">
                      {formData.fundingGoalINR ? formatCurrency(Number(formData.fundingGoalINR)) : 'Undisclosed'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Equity Offered</span>
                    <span className="font-semibold text-emerald-700">
                      {formData.equityOffered ? `${formData.equityOffered}%` : 'Negotiable'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Location</span>
                    <span className="font-medium text-slate-800">{formData.location || 'India'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  Saving as a <strong>Draft</strong> keeps the listing private to your account only.
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  Clicking <strong>Publish Immediately</strong> submits your startup to the public Explore Startups directory.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        {/* Wizard Controls Footer */}
        <CardFooter className="flex items-center justify-between border-t border-slate-100 p-6 bg-slate-50/50 rounded-b-xl">
          <div>
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handlePrev}>
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 6 ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                >
                  Save Draft
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white"
                >
                  Next Step <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                >
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  loading={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Publish Startup Listing
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

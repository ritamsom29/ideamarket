import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { updateStartup } from '@/actions/startups'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { STARTUP_STAGES, FUNDING_TYPES } from '@/lib/utils'
import { DEMO_STARTUPS } from '@/lib/demo-data'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function EditStartupPage({ params }: Props) {
  const session = await auth()
  const { id } = await params
  const userId = session?.user?.id!

  let startup = null
  try {
    startup = await prisma.startup.findUnique({
      where: { id },
    })
  } catch {
    const demo = DEMO_STARTUPS.find(s => s.id === id || s.slug === id)
    if (demo) {
      startup = {
        ...demo,
        userId: demo.founder.id,
        fundingGoalINR: BigInt(demo.fundingGoalINR),
        fundingRaisedINR: BigInt(demo.fundingRaisedINR),
        equityOffered: demo.equityOffered as any,
        monthlyRevenue: BigInt(demo.monthlyRevenue),
      } as any
    }
  }

  if (!startup) {
    notFound()
  }

  if (startup.userId !== userId && session?.user?.role !== 'ADMIN') {
    redirect('/dashboard/startups')
  }

  async function handleUpdate(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const tagline = formData.get('tagline') as string
    const description = formData.get('description') as string
    const stage = formData.get('stage') as any
    const fundingType = formData.get('fundingType') as any
    const fundingGoalINR = Number(formData.get('fundingGoalINR')) || null
    const equityOffered = Number(formData.get('equityOffered')) || null
    const location = formData.get('location') as string
    const websiteUrl = formData.get('websiteUrl') as string
    const problemStatement = formData.get('problemStatement') as string
    const solutionDescription = formData.get('solutionDescription') as string
    const traction = formData.get('traction') as string

    await updateStartup(id, {
      name,
      tagline,
      description,
      stage,
      fundingType,
      fundingGoalINR,
      equityOffered,
      location,
      websiteUrl,
      problemStatement,
      solutionDescription,
      traction,
    })

    redirect('/dashboard/startups')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild className="gap-2">
        <Link href="/dashboard/startups">
          <ArrowLeft className="h-4 w-4" /> Back to My Startups
        </Link>
      </Button>

      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl">Edit Startup: {startup.name}</CardTitle>
        </CardHeader>

        <form action={handleUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Startup Name</Label>
              <Input id="name" name="name" defaultValue={startup.name} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" defaultValue={startup.tagline || ''} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={startup.description || ''} rows={4} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="stage">Development Stage</Label>
                <select
                  id="stage"
                  name="stage"
                  defaultValue={startup.stage}
                  className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none"
                >
                  {STARTUP_STAGES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fundingGoalINR">Funding Target (INR)</Label>
                <Input
                  id="fundingGoalINR"
                  name="fundingGoalINR"
                  type="number"
                  defaultValue={startup.fundingGoalINR ? Number(startup.fundingGoalINR) : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="equityOffered">Equity Offered (%)</Label>
                <Input
                  id="equityOffered"
                  name="equityOffered"
                  type="number"
                  step="0.1"
                  defaultValue={startup.equityOffered ? Number(startup.equityOffered) : ''}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" defaultValue={startup.location || ''} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="problemStatement">Problem Statement</Label>
              <Textarea id="problemStatement" name="problemStatement" defaultValue={startup.problemStatement || ''} rows={3} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="solutionDescription">Solution Description</Label>
              <Textarea id="solutionDescription" name="solutionDescription" defaultValue={startup.solutionDescription || ''} rows={3} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="traction">Traction & Metrics</Label>
              <Textarea id="traction" name="traction" defaultValue={startup.traction || ''} rows={3} />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard/startups">Cancel</Link>
              </Button>
              <Button type="submit" className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

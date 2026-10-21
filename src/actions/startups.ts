'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { generateSlug } from '@/lib/utils'
import { StartupStage, StartupStatus, FundingType } from '@prisma/client'

const startupSchema = z.object({
  name: z.string().min(2, 'Startup name is required'),
  tagline: z.string().min(5, 'Tagline is required'),
  description: z.string().min(20, 'Please provide a detailed description'),
  stage: z.nativeEnum(StartupStage),
  fundingType: z.nativeEnum(FundingType).optional(),
  fundingGoalINR: z.number().positive().optional().nullable(),
  equityOffered: z.number().min(0).max(100).optional().nullable(),
  location: z.string().min(2, 'Location is required'),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  problemStatement: z.string().optional(),
  solutionDescription: z.string().optional(),
  productDescription: z.string().optional(),
  marketOpportunity: z.string().optional(),
  businessModel: z.string().optional(),
  competitiveAdvantage: z.string().optional(),
  targetCustomers: z.string().optional(),
  useOfFunds: z.string().optional(),
  traction: z.string().optional(),
  teamSize: z.number().int().min(1).default(1),
  industryId: z.string().optional(),
})

export async function createStartup(data: any, publishImmediately = false) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please sign in.' }
  }

  if (session.user.role !== 'ENTREPRENEUR' && session.user.role !== 'ADMIN') {
    return { success: false, error: 'Only entrepreneurs can create startups.' }
  }

  try {
    const slugBase = generateSlug(data.name || 'startup')
    const uniqueSlug = `${slugBase}-${Date.now().toString().slice(-4)}`

    const startup = await prisma.startup.create({
      data: {
        userId: session.user.id,
        name: data.name,
        slug: uniqueSlug,
        tagline: data.tagline,
        description: data.description,
        stage: (data.stage as StartupStage) || StartupStage.IDEA,
        status: publishImmediately ? StartupStatus.PUBLISHED : StartupStatus.DRAFT,
        fundingType: data.fundingType ? (data.fundingType as FundingType) : null,
        fundingGoalINR: data.fundingGoalINR ? BigInt(data.fundingGoalINR) : null,
        equityOffered: data.equityOffered || null,
        location: data.location || 'Pan-India',
        websiteUrl: data.websiteUrl || null,
        problemStatement: data.problemStatement || null,
        solutionDescription: data.solutionDescription || null,
        productDescription: data.productDescription || null,
        marketOpportunity: data.marketOpportunity || null,
        businessModel: data.businessModel || null,
        competitiveAdvantage: data.competitiveAdvantage || null,
        targetCustomers: data.targetCustomers || null,
        useOfFunds: data.useOfFunds || null,
        traction: data.traction || null,
        teamSize: Number(data.teamSize) || 1,
        publishedAt: publishImmediately ? new Date() : null,
        industries: data.industryId
          ? {
              create: [
                {
                  industryId: data.industryId,
                },
              ],
            }
          : undefined,
      },
    })

    revalidatePath('/startups')
    revalidatePath('/dashboard/startups')
    return { success: true, startupId: startup.id, slug: startup.slug }
  } catch (error) {
    console.error('Error creating startup:', error)
    return { success: false, error: 'Failed to create startup. Please try again.' }
  }
}

export async function updateStartup(id: string, data: any) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized.' }
  }

  try {
    // Verify ownership
    const existing = await prisma.startup.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existing || (existing.userId !== session.user.id && session.user.role !== 'ADMIN')) {
      return { success: false, error: 'Not authorized to edit this startup.' }
    }

    const updated = await prisma.startup.update({
      where: { id },
      data: {
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        stage: data.stage as StartupStage,
        fundingType: data.fundingType ? (data.fundingType as FundingType) : null,
        fundingGoalINR: data.fundingGoalINR ? BigInt(data.fundingGoalINR) : null,
        equityOffered: data.equityOffered !== undefined ? data.equityOffered : undefined,
        location: data.location,
        websiteUrl: data.websiteUrl || null,
        problemStatement: data.problemStatement,
        solutionDescription: data.solutionDescription,
        productDescription: data.productDescription,
        marketOpportunity: data.marketOpportunity,
        businessModel: data.businessModel,
        competitiveAdvantage: data.competitiveAdvantage,
        targetCustomers: data.targetCustomers,
        useOfFunds: data.useOfFunds,
        traction: data.traction,
        teamSize: data.teamSize ? Number(data.teamSize) : undefined,
      },
    })

    revalidatePath(`/startups/${updated.slug}`)
    revalidatePath('/dashboard/startups')
    return { success: true, slug: updated.slug }
  } catch (error) {
    console.error('Error updating startup:', error)
    return { success: false, error: 'Failed to update startup details.' }
  }
}

export async function setStartupStatus(id: string, status: StartupStatus) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized.' }
  }

  try {
    const existing = await prisma.startup.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existing || (existing.userId !== session.user.id && session.user.role !== 'ADMIN')) {
      return { success: false, error: 'Forbidden. You do not own this startup.' }
    }

    const updated = await prisma.startup.update({
      where: { id },
      data: {
        status,
        publishedAt: status === StartupStatus.PUBLISHED ? new Date() : undefined,
      },
    })

    revalidatePath('/startups')
    revalidatePath(`/startups/${updated.slug}`)
    revalidatePath('/dashboard/startups')
    return { success: true }
  } catch (error) {
    console.error('Status change error:', error)
    return { success: false, error: 'Failed to change status.' }
  }
}

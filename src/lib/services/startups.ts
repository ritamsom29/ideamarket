import prisma from '@/lib/prisma'
import { DEMO_STARTUPS, DemoStartup } from '@/lib/demo-data'

export interface StartupFilterOptions {
  search?: string
  industry?: string
  stage?: string
  minFunding?: number
  maxFunding?: number
  location?: string
  sortBy?: 'newest' | 'funding_high' | 'funding_low' | 'name'
  page?: number
  limit?: number
}

export async function getPublishedStartups(options: StartupFilterOptions = {}) {
  const {
    search = '',
    industry = '',
    stage = '',
    minFunding,
    maxFunding,
    location = '',
    sortBy = 'newest',
    page = 1,
    limit = 12,
  } = options

  try {
    const where: any = {
      status: 'PUBLISHED',
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (stage) {
      where.stage = stage
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (industry) {
      where.industries = {
        some: {
          industry: {
            slug: industry,
          },
        },
      }
    }

    if (minFunding !== undefined || maxFunding !== undefined) {
      where.fundingGoalINR = {}
      if (minFunding !== undefined) where.fundingGoalINR.gte = BigInt(minFunding)
      if (maxFunding !== undefined) where.fundingGoalINR.lte = BigInt(maxFunding)
    }

    let orderBy: any = { publishedAt: 'desc' }
    if (sortBy === 'funding_high') orderBy = { fundingGoalINR: 'desc' }
    if (sortBy === 'funding_low') orderBy = { fundingGoalINR: 'asc' }
    if (sortBy === 'name') orderBy = { name: 'asc' }

    const [total, startups] = await Promise.all([
      prisma.startup.count({ where }),
      prisma.startup.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
          industries: {
            include: { industry: true },
          },
        },
      }),
    ])

    return {
      startups: startups.map(s => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        tagline: s.tagline || '',
        description: s.description || '',
        stage: s.stage,
        status: s.status,
        fundingType: s.fundingType,
        fundingGoalINR: s.fundingGoalINR ? Number(s.fundingGoalINR) : null,
        fundingRaisedINR: s.fundingRaisedINR ? Number(s.fundingRaisedINR) : null,
        equityOffered: s.equityOffered ? Number(s.equityOffered) : null,
        location: s.location || '',
        websiteUrl: s.websiteUrl || '',
        logoUrl: s.logoUrl || '',
        coverImageUrl: s.coverImageUrl || '',
        traction: s.traction || '',
        teamSize: s.teamSize || 1,
        publishedAt: s.publishedAt?.toISOString() || s.createdAt.toISOString(),
        founder: {
          id: s.user.id,
          name: s.user.name || 'Anonymous Founder',
          email: s.user.email,
          image: s.user.image || '',
        },
        industries: s.industries.map(i => ({
          id: i.industry.id,
          name: i.industry.name,
          slug: i.industry.slug,
        })),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    }
  } catch (error) {
    console.warn('Prisma query failed, falling back to local dataset:', (error as Error).message)
    // Filter demo startups locally
    let filtered = [...DEMO_STARTUPS]

    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.tagline.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      )
    }

    if (stage) {
      filtered = filtered.filter(s => s.stage === stage)
    }

    if (location) {
      filtered = filtered.filter(s => s.location.toLowerCase().includes(location.toLowerCase()))
    }

    if (industry) {
      filtered = filtered.filter(s => s.industries.some(i => i.slug === industry))
    }

    if (minFunding !== undefined) {
      filtered = filtered.filter(s => s.fundingGoalINR >= minFunding)
    }
    if (maxFunding !== undefined) {
      filtered = filtered.filter(s => s.fundingGoalINR <= maxFunding)
    }

    if (sortBy === 'funding_high') {
      filtered.sort((a, b) => b.fundingGoalINR - a.fundingGoalINR)
    } else if (sortBy === 'funding_low') {
      filtered.sort((a, b) => a.fundingGoalINR - b.fundingGoalINR)
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    const total = filtered.length
    const paginated = filtered.slice((page - 1) * limit, page * limit)

    return {
      startups: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    }
  }
}

export async function getStartupBySlug(slug: string) {
  try {
    const startup = await prisma.startup.findUnique({
      where: { slug },
      include: {
        user: {
          include: {
            entrepreneurProfile: true,
          },
        },
        industries: {
          include: { industry: true },
        },
        teamMembers: {
          orderBy: { order: 'asc' },
        },
        documents: true,
      },
    })

    if (!startup) return null

    return {
      id: startup.id,
      name: startup.name,
      slug: startup.slug,
      tagline: startup.tagline || '',
      description: startup.description || '',
      stage: startup.stage,
      status: startup.status,
      fundingType: startup.fundingType,
      fundingGoalINR: startup.fundingGoalINR ? Number(startup.fundingGoalINR) : null,
      fundingRaisedINR: startup.fundingRaisedINR ? Number(startup.fundingRaisedINR) : null,
      equityOffered: startup.equityOffered ? Number(startup.equityOffered) : null,
      location: startup.location || '',
      websiteUrl: startup.websiteUrl || '',
      logoUrl: startup.logoUrl || '',
      coverImageUrl: startup.coverImageUrl || '',
      problemStatement: startup.problemStatement || '',
      solutionDescription: startup.solutionDescription || '',
      productDescription: startup.productDescription || '',
      marketOpportunity: startup.marketOpportunity || '',
      businessModel: startup.businessModel || '',
      competitiveAdvantage: startup.competitiveAdvantage || '',
      targetCustomers: startup.targetCustomers || '',
      useOfFunds: startup.useOfFunds || '',
      traction: startup.traction || '',
      monthlyRevenue: startup.monthlyRevenue ? Number(startup.monthlyRevenue) : null,
      monthlyActiveUsers: startup.monthlyActiveUsers || null,
      teamSize: startup.teamSize || 1,
      publishedAt: startup.publishedAt?.toISOString() || startup.createdAt.toISOString(),
      founder: {
        id: startup.user.id,
        name: startup.user.name || 'Anonymous Founder',
        email: startup.user.email,
        image: startup.user.image || '',
        bio: startup.user.entrepreneurProfile?.bio || '',
        location: startup.user.entrepreneurProfile?.location || '',
      },
      industries: startup.industries.map(i => ({
        id: i.industry.id,
        name: i.industry.name,
        slug: i.industry.slug,
      })),
      teamMembers: startup.teamMembers.map(t => ({
        id: t.id,
        name: t.name,
        role: t.role,
        bio: t.bio || '',
        linkedinUrl: t.linkedinUrl || undefined,
      })),
      documents: startup.documents.map(d => ({
        id: d.id,
        name: d.name,
        fileUrl: d.fileUrl,
        fileType: d.fileType,
        fileSize: d.fileSize,
        isPublic: d.isPublic,
        description: d.description || '',
      })),
    }
  } catch (error) {
    console.warn('Prisma query failed, searching local demo startups:', (error as Error).message)
    const found = DEMO_STARTUPS.find(s => s.slug === slug)
    return found || null
  }
}

export async function getFeaturedStartups(limit = 4) {
  try {
    const res = await getPublishedStartups({ limit, sortBy: 'newest' })
    return res.startups
  } catch {
    return DEMO_STARTUPS.slice(0, limit)
  }
}

/**
 * Transparent rule-based startup recommendations for investors
 * Computes compatibility score based on:
 * - Preferred industries match (40%)
 * - Preferred startup stage match (30%)
 * - Funding goal compatibility (20%)
 * - Geographic preference match (10%)
 */
export async function getStartupRecommendations(preferences: {
  industries?: string[]
  stages?: string[]
  minBudget?: number
  maxBudget?: number
  locations?: string[]
}) {
  const { startups } = await getPublishedStartups({ limit: 50 })
  const scored = startups.map(startup => {
    let score = 0
    const reasons: string[] = []

    // Industry compatibility
    if (preferences.industries && preferences.industries.length > 0) {
      const match = startup.industries.some(i => preferences.industries!.includes(i.slug))
      if (match) {
        score += 40
        reasons.push('Matches preferred industry focus')
      }
    }

    // Stage compatibility
    if (preferences.stages && preferences.stages.length > 0) {
      if (preferences.stages.includes(startup.stage)) {
        score += 30
        reasons.push(`Matches target stage (${startup.stage})`)
      }
    }

    // Funding range compatibility
    if (startup.fundingGoalINR && (preferences.minBudget || preferences.maxBudget)) {
      const min = preferences.minBudget || 0
      const max = preferences.maxBudget || Infinity
      if (startup.fundingGoalINR >= min && startup.fundingGoalINR <= max) {
        score += 20
        reasons.push('Funding requirements align with ticket size')
      }
    }

    // Location compatibility
    if (preferences.locations && preferences.locations.length > 0) {
      const locMatch = preferences.locations.some(loc =>
        startup.location.toLowerCase().includes(loc.toLowerCase())
      )
      if (locMatch) {
        score += 10
        reasons.push('Aligned with target geography')
      }
    }

    return {
      startup,
      score,
      reasons,
    }
  })

  // Sort descending by score
  return scored.sort((a, b) => b.score - a.score)
}

import prisma from '@/lib/prisma'
import { DEMO_INVESTORS, DemoInvestor } from '@/lib/demo-data'

export interface InvestorFilterOptions {
  search?: string
  industry?: string
  stage?: string
  location?: string
  page?: number
  limit?: number
}

export async function getInvestors(options: InvestorFilterOptions = {}) {
  const {
    search = '',
    industry = '',
    stage = '',
    location = '',
    page = 1,
    limit = 12,
  } = options

  try {
    const where: any = {
      isProfilePublic: true,
      user: {
        isActive: true,
      },
    }

    if (search) {
      where.OR = [
        { organization: { contains: search, mode: 'insensitive' } },
        { designation: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (industry) {
      where.preferredIndustries = {
        some: {
          industry: {
            slug: industry,
          },
        },
      }
    }

    if (stage) {
      where.preferredStages = {
        has: stage,
      }
    }

    const [total, profiles] = await Promise.all([
      prisma.investorProfile.count({ where }),
      prisma.investorProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
          preferredIndustries: {
            include: { industry: true },
          },
        },
      }),
    ])

    return {
      investors: profiles.map(p => ({
        id: p.id,
        userId: p.userId,
        name: p.user.name || 'Anonymous Investor',
        email: p.user.email,
        image: p.user.image || '',
        organization: p.organization || 'Independent Angel',
        designation: p.designation || 'Investor',
        bio: p.bio || '',
        location: p.location || '',
        linkedinUrl: p.linkedinUrl || '',
        minInvestmentINR: p.minInvestmentINR ? Number(p.minInvestmentINR) : 0,
        maxInvestmentINR: p.maxInvestmentINR ? Number(p.maxInvestmentINR) : 0,
        preferredStages: p.preferredStages,
        geographicFocus: p.geographicFocus,
        investmentThesis: p.investmentThesis || '',
        isProfilePublic: p.isProfilePublic,
        showInvestmentRange: p.showInvestmentRange,
        preferredIndustries: p.preferredIndustries.map(pi => ({
          id: pi.industry.id,
          name: pi.industry.name,
          slug: pi.industry.slug,
        })),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    }
  } catch (error) {
    console.warn('Prisma query failed, falling back to local demo investors:', (error as Error).message)
    let filtered = [...DEMO_INVESTORS]

    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        i =>
          i.name.toLowerCase().includes(q) ||
          i.organization.toLowerCase().includes(q) ||
          i.bio.toLowerCase().includes(q)
      )
    }

    if (location) {
      filtered = filtered.filter(i => i.location.toLowerCase().includes(location.toLowerCase()))
    }

    if (industry) {
      filtered = filtered.filter(i => i.preferredIndustries.some(ind => ind.slug === industry))
    }

    if (stage) {
      filtered = filtered.filter(i => i.preferredStages.includes(stage))
    }

    const total = filtered.length
    const paginated = filtered.slice((page - 1) * limit, page * limit)

    return {
      investors: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    }
  }
}

export async function getInvestorById(id: string) {
  try {
    const p = await prisma.investorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        preferredIndustries: {
          include: { industry: true },
        },
      },
    })

    if (!p) return null

    return {
      id: p.id,
      userId: p.userId,
      name: p.user.name || 'Anonymous Investor',
      email: p.user.email,
      image: p.user.image || '',
      organization: p.organization || 'Independent Angel',
      designation: p.designation || 'Investor',
      bio: p.bio || '',
      location: p.location || '',
      linkedinUrl: p.linkedinUrl || '',
      minInvestmentINR: p.minInvestmentINR ? Number(p.minInvestmentINR) : 0,
      maxInvestmentINR: p.maxInvestmentINR ? Number(p.maxInvestmentINR) : 0,
      preferredStages: p.preferredStages,
      geographicFocus: p.geographicFocus,
      investmentThesis: p.investmentThesis || '',
      isProfilePublic: p.isProfilePublic,
      showInvestmentRange: p.showInvestmentRange,
      preferredIndustries: p.preferredIndustries.map(pi => ({
        id: pi.industry.id,
        name: pi.industry.name,
        slug: pi.industry.slug,
      })),
    }
  } catch (error) {
    const found = DEMO_INVESTORS.find(i => i.id === id || i.userId === id)
    return found || null
  }
}

export async function getFeaturedInvestors(limit = 3) {
  try {
    const res = await getInvestors({ limit })
    return res.investors
  } catch {
    return DEMO_INVESTORS.slice(0, limit)
  }
}

import prisma from '@/lib/prisma'
import { DEMO_MENTORS, DemoMentor } from '@/lib/demo-data'

export interface MentorFilterOptions {
  search?: string
  industry?: string
  expertise?: string
  location?: string
  page?: number
  limit?: number
}

export async function getMentors(options: MentorFilterOptions = {}) {
  const {
    search = '',
    industry = '',
    expertise = '',
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
        { headline: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { mentorshipFocus: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (industry) {
      where.supportedIndustries = {
        some: {
          industry: {
            slug: industry,
          },
        },
      }
    }

    if (expertise) {
      where.expertiseAreas = {
        some: {
          expertise: { contains: expertise, mode: 'insensitive' },
        },
      }
    }

    const [total, profiles] = await Promise.all([
      prisma.mentorProfile.count({ where }),
      prisma.mentorProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
          supportedIndustries: {
            include: { industry: true },
          },
          expertiseAreas: true,
        },
      }),
    ])

    return {
      mentors: profiles.map(p => ({
        id: p.id,
        userId: p.userId,
        name: p.user.name || 'Anonymous Mentor',
        email: p.user.email,
        image: p.user.image || '',
        headline: p.headline || 'Startup Mentor',
        bio: p.bio || '',
        location: p.location || '',
        linkedinUrl: p.linkedinUrl || '',
        yearsExperience: p.yearsExperience || 0,
        isAvailable: p.isAvailable,
        maxMentees: p.maxMentees || 5,
        mentorshipFocus: p.mentorshipFocus || '',
        isProfilePublic: p.isProfilePublic,
        supportedIndustries: p.supportedIndustries.map(si => ({
          id: si.industry.id,
          name: si.industry.name,
          slug: si.industry.slug,
        })),
        expertiseAreas: p.expertiseAreas.map(e => e.expertise),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    }
  } catch (error) {
    console.warn('Prisma query failed, falling back to local demo mentors:', (error as Error).message)
    let filtered = [...DEMO_MENTORS]

    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        m =>
          m.name.toLowerCase().includes(q) ||
          m.headline.toLowerCase().includes(q) ||
          m.bio.toLowerCase().includes(q)
      )
    }

    if (location) {
      filtered = filtered.filter(m => m.location.toLowerCase().includes(location.toLowerCase()))
    }

    if (industry) {
      filtered = filtered.filter(m => m.supportedIndustries.some(ind => ind.slug === industry))
    }

    if (expertise) {
      filtered = filtered.filter(m =>
        m.expertiseAreas.some(e => e.toLowerCase().includes(expertise.toLowerCase()))
      )
    }

    const total = filtered.length
    const paginated = filtered.slice((page - 1) * limit, page * limit)

    return {
      mentors: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    }
  }
}

export async function getMentorById(id: string) {
  try {
    const p = await prisma.mentorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        supportedIndustries: {
          include: { industry: true },
        },
        expertiseAreas: true,
      },
    })

    if (!p) return null

    return {
      id: p.id,
      userId: p.userId,
      name: p.user.name || 'Anonymous Mentor',
      email: p.user.email,
      image: p.user.image || '',
      headline: p.headline || 'Startup Mentor',
      bio: p.bio || '',
      location: p.location || '',
      linkedinUrl: p.linkedinUrl || '',
      yearsExperience: p.yearsExperience || 0,
      isAvailable: p.isAvailable,
      maxMentees: p.maxMentees || 5,
      mentorshipFocus: p.mentorshipFocus || '',
      isProfilePublic: p.isProfilePublic,
      supportedIndustries: p.supportedIndustries.map(si => ({
        id: si.industry.id,
        name: si.industry.name,
        slug: si.industry.slug,
      })),
      expertiseAreas: p.expertiseAreas.map(e => e.expertise),
    }
  } catch (error) {
    const found = DEMO_MENTORS.find(m => m.id === id || m.userId === id)
    return found || null
  }
}

export async function getFeaturedMentors(limit = 3) {
  try {
    const res = await getMentors({ limit })
    return res.mentors
  } catch {
    return DEMO_MENTORS.slice(0, limit)
  }
}

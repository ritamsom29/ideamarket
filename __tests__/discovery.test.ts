import { getPublishedStartups, getStartupBySlug } from '@/lib/services/startups'

describe('Startup Discovery & Filtering Service', () => {
  test('returns published startups list with valid pagination metadata', async () => {
    const res = await getPublishedStartups({ page: 1, limit: 10 })
    expect(res).toBeDefined()
    expect(Array.isArray(res.startups)).toBe(true)
    expect(res.total).toBeGreaterThan(0)
    expect(res.page).toBe(1)
  })

  test('filters startups accurately by keyword search', async () => {
    const res = await getPublishedStartups({ search: 'PayFlow' })
    expect(res.startups.length).toBeGreaterThan(0)
    expect(res.startups.some(s => s.name.includes('PayFlow'))).toBe(true)
  })

  test('filters startups accurately by industry slug', async () => {
    const res = await getPublishedStartups({ industry: 'fintech-payments' })
    expect(res.startups.length).toBeGreaterThan(0)
    expect(res.startups.every(s => s.industries.some(i => i.slug === 'fintech-payments'))).toBe(true)
  })

  test('filters startups accurately by stage', async () => {
    const res = await getPublishedStartups({ stage: 'EARLY_STAGE' })
    expect(res.startups.length).toBeGreaterThan(0)
    expect(res.startups.every(s => s.stage === 'EARLY_STAGE')).toBe(true)
  })

  test('retrieves detailed startup profile by slug', async () => {
    const startup = await getStartupBySlug('payflow-india')
    expect(startup).toBeDefined()
    expect(startup?.name).toBe('PayFlow India')
    expect(startup?.founder).toBeDefined()
    expect(startup?.founder.name).toBe('Aarav Sharma')
  })

  test('returns null for non-existent startup slug', async () => {
    const startup = await getStartupBySlug('non-existent-startup-xyz')
    expect(startup).toBeNull()
  })
})

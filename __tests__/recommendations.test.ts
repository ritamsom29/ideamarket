import { getStartupRecommendations } from '@/lib/services/startups'

describe('Rule-Based Recommendation Engine', () => {
  test('ranks industry-matched startups with higher compatibility scores', async () => {
    const preferences = {
      industries: ['fintech-payments'],
      stages: ['EARLY_STAGE'],
    }

    const recommendations = await getStartupRecommendations(preferences)
    expect(recommendations.length).toBeGreaterThan(0)

    const topRecommendation = recommendations[0]
    expect(topRecommendation.score).toBeGreaterThan(0)
    expect(topRecommendation.reasons.length).toBeGreaterThan(0)
    expect(
      topRecommendation.reasons.some(r => r.includes('industry'))
    ).toBe(true)
  })

  test('awards stage compatibility points when startup matches preference', async () => {
    const preferences = {
      stages: ['MVP'],
    }

    const recommendations = await getStartupRecommendations(preferences)
    const mvpStartup = recommendations.find(r => r.startup.stage === 'MVP')
    expect(mvpStartup).toBeDefined()
    expect(mvpStartup?.reasons.some(r => r.includes('stage'))).toBe(true)
  })

  test('validates ticket size compatibility within investor budget', async () => {
    const preferences = {
      minBudget: 10000000, // 1 Cr
      maxBudget: 30000000, // 3 Cr
    }

    const recommendations = await getStartupRecommendations(preferences)
    const aligned = recommendations.find(r => r.startup.name === 'PayFlow India')
    expect(aligned).toBeDefined()
    expect(aligned?.reasons.some(r => r.includes('ticket size'))).toBe(true)
  })
})

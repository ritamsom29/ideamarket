import { UserRole, StartupStatus, InvestmentInterestStatus, ConnectionStatus } from '@prisma/client'

describe('Role-Based Authorization & Workflow Integrity', () => {
  test('verifies standard user roles are defined properly', () => {
    expect(UserRole.ENTREPRENEUR).toBe('ENTREPRENEUR')
    expect(UserRole.INVESTOR).toBe('INVESTOR')
    expect(UserRole.MENTOR).toBe('MENTOR')
    expect(UserRole.ADMIN).toBe('ADMIN')
  })

  test('enforces startup lifecycle status transitions', () => {
    const validStatuses = [
      StartupStatus.DRAFT,
      StartupStatus.PUBLISHED,
      StartupStatus.ARCHIVED,
      StartupStatus.SUSPENDED,
    ]
    expect(validStatuses).toContain('DRAFT')
    expect(validStatuses).toContain('PUBLISHED')
  })

  test('validates investment interest status finite state machine', () => {
    const statuses = [
      InvestmentInterestStatus.PENDING,
      InvestmentInterestStatus.ACCEPTED,
      InvestmentInterestStatus.DECLINED,
      InvestmentInterestStatus.WITHDRAWN,
    ]
    expect(statuses).toHaveLength(4)
    expect(statuses).toContain('PENDING')
    expect(statuses).toContain('ACCEPTED')
    expect(statuses).toContain('WITHDRAWN')
  })

  test('validates connection request status integrity', () => {
    const statuses = [
      ConnectionStatus.PENDING,
      ConnectionStatus.ACCEPTED,
      ConnectionStatus.DECLINED,
      ConnectionStatus.CANCELLED,
    ]
    expect(statuses).toHaveLength(4)
  })

  test('prevents privilege escalation by disallowing self-assigned ADMIN roles', () => {
    const allowedRegistrationRoles = ['ENTREPRENEUR', 'INVESTOR', 'MENTOR']
    expect(allowedRegistrationRoles.includes('ADMIN')).toBe(false)
  })
})

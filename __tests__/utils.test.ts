import { formatCurrency, generateSlug, getInitials, truncate } from '@/lib/utils'

describe('Utils & Currency Formatter', () => {
  test('formats INR amounts in Crores properly', () => {
    expect(formatCurrency(25000000)).toBe('₹2.5Cr')
    expect(formatCurrency(100000000)).toBe('₹10.0Cr')
  })

  test('formats INR amounts in Lakhs properly', () => {
    expect(formatCurrency(7500000)).toBe('₹75.0L')
    expect(formatCurrency(1200000)).toBe('₹12.0L')
    expect(formatCurrency(500000)).toBe('₹5.0L')
  })

  test('formats smaller INR numbers correctly', () => {
    expect(formatCurrency(50000)).toBe('₹50.0K')
    expect(formatCurrency(850)).toBe('₹850')
  })

  test('handles null, undefined and BigInt gracefully', () => {
    expect(formatCurrency(null)).toBe('')
    expect(formatCurrency(undefined)).toBe('')
    expect(formatCurrency(BigInt(50000000))).toBe('₹5.0Cr')
  })

  test('generateSlug converts strings to clean, URL-safe slugs', () => {
    expect(generateSlug('PayFlow India - 2026!')).toBe('payflow-india-2026')
    expect(generateSlug('  GreenGrid Mobility EV  ')).toBe('greengrid-mobility-ev')
    expect(generateSlug('AI & DeepTech Solutions')).toBe('ai-deeptech-solutions')
  })

  test('getInitials extracts first letters properly', () => {
    expect(getInitials('Aarav Sharma')).toBe('AS')
    expect(getInitials('Priya')).toBe('P')
    expect(getInitials('')).toBe('?')
    expect(getInitials(null)).toBe('?')
  })

  test('truncate limits strings without breaking words abruptly', () => {
    expect(truncate('Hello world', 20)).toBe('Hello world')
    expect(truncate('Supercalifragilisticexpialidocious', 5)).toBe('Super...')
  })
})

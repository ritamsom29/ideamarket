import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | bigint | null | undefined): string {
  if (amount === null || amount === undefined) return ''
  const num = typeof amount === 'bigint' ? Number(amount) : amount
  if (num >= 10000000) {
    return `\u20B9${(num / 10000000).toFixed(1)}Cr`
  } else if (num >= 100000) {
    return `\u20B9${(num / 100000).toFixed(1)}L`
  } else if (num >= 1000) {
    return `\u20B9${(num / 1000).toFixed(1)}K`
  }
  return `\u20B9${num.toLocaleString('en-IN')}`
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return formatDate(date)
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60)
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export const STARTUP_STAGES = [
  { value: 'IDEA', label: 'Idea Stage' },
  { value: 'MVP', label: 'MVP' },
  { value: 'EARLY_STAGE', label: 'Early Stage' },
  { value: 'GROWTH', label: 'Growth' },
  { value: 'SCALING', label: 'Scaling' },
  { value: 'ESTABLISHED', label: 'Established' },
] as const

export const FUNDING_TYPES = [
  { value: 'BOOTSTRAPPED', label: 'Bootstrapped' },
  { value: 'ANGEL', label: 'Angel' },
  { value: 'SEED', label: 'Seed' },
  { value: 'SERIES_A', label: 'Series A' },
  { value: 'SERIES_B', label: 'Series B' },
  { value: 'SERIES_C_PLUS', label: 'Series C+' },
  { value: 'GRANT', label: 'Grant' },
  { value: 'CROWDFUNDING', label: 'Crowdfunding' },
] as const

export const USER_ROLES = [
  { value: 'ENTREPRENEUR', label: 'Entrepreneur' },
  { value: 'INVESTOR', label: 'Investor' },
  { value: 'MENTOR', label: 'Mentor' },
] as const

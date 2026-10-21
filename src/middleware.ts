import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/messages',
  '/notifications',
  '/connections',
  '/startups/new',
  '/startups/edit',
  '/onboarding',
]

// Routes only for non-authenticated users
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

// Admin-only routes
const adminRoutes = ['/admin']

export default auth((req: NextRequest & { auth: { user?: { role?: string; onboardingCompleted?: boolean } } | null }) => {
  const { nextUrl, auth: session } = req as { nextUrl: URL; auth: { user?: { role?: string; onboardingCompleted?: boolean } } | null }
  const isLoggedIn = !!session?.user
  const userRole = session?.user?.role
  const onboardingCompleted = session?.user?.onboardingCompleted
  const pathname = nextUrl.pathname

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn || userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', nextUrl))
    }
    return NextResponse.next()
  }

  // Redirect logged-in users away from auth pages
  if (authRoutes.some(r => pathname.startsWith(r))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
    return NextResponse.next()
  }

  // Protected routes
  if (protectedRoutes.some(r => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, nextUrl)
      )
    }

    // Redirect to onboarding if not completed (except for /onboarding itself)
    if (!onboardingCompleted && !pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/onboarding', nextUrl))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import type { UserRole } from '@prisma/client'

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const DEMO_AUTH_USERS: Record<string, { id: string; email: string; name: string; role: UserRole; onboardingCompleted: boolean; image: string }> = {
  'admin@ideamarket.in': {
    id: 'usr-admin',
    email: 'admin@ideamarket.in',
    name: 'System Administrator',
    role: 'ADMIN',
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
  'aarav.sharma@payflow.in': {
    id: 'usr-aarav',
    email: 'aarav.sharma@payflow.in',
    name: 'Aarav Sharma',
    role: 'ENTREPRENEUR',
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  'priya.patel@greengrid.in': {
    id: 'usr-priya',
    email: 'priya.patel@greengrid.in',
    name: 'Priya Patel',
    role: 'ENTREPRENEUR',
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
  'rohan.gupta@kisaansetu.in': {
    id: 'usr-rohan',
    email: 'rohan.gupta@kisaansetu.in',
    name: 'Rohan Gupta',
    role: 'ENTREPRENEUR',
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  'dr.sneha@medisync.in': {
    id: 'usr-sneha',
    email: 'dr.sneha@medisync.in',
    name: 'Dr. Sneha Roy',
    role: 'ENTREPRENEUR',
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  'rajesh.singhania@apexventures.in': {
    id: 'usr-rajesh',
    email: 'rajesh.singhania@apexventures.in',
    name: 'Rajesh Singhania',
    role: 'INVESTOR',
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  'ananya.sen@bengaluruangels.in': {
    id: 'usr-ananya',
    email: 'ananya.sen@bengaluruangels.in',
    name: 'Ananya Sen',
    role: 'INVESTOR',
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
  'sanjay.mehta@scaleadvisors.in': {
    id: 'usr-sanjay',
    email: 'sanjay.mehta@scaleadvisors.in',
    name: 'Sanjay Mehta',
    role: 'MENTOR',
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
  },
  'radhika.nair@healthx.org': {
    id: 'usr-radhika',
    email: 'radhika.nair@healthx.org',
    name: 'Dr. Radhika Nair',
    role: 'MENTOR',
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data
        const normalizedEmail = email.toLowerCase().trim()

        // 1. Dual-mode fallback: match demo credentials directly
        const demoUser = DEMO_AUTH_USERS[normalizedEmail]
        if (demoUser && password === 'Password@123') {
          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            image: demoUser.image,
            role: demoUser.role,
            onboardingCompleted: demoUser.onboardingCompleted,
          }
        }

        // 2. Query Prisma database if available
        try {
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          })

          if (user && user.password) {
            if (!user.isActive) throw new Error('Account suspended')
            const passwordMatch = await bcrypt.compare(password, user.password)
            if (passwordMatch) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role,
                onboardingCompleted: user.onboardingCompleted,
              }
            }
          }
        } catch (dbError) {
          console.warn('Prisma auth lookup failed (DB may be offline):', (dbError as Error).message)
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as { role: UserRole }).role
        token.onboardingCompleted = (user as { onboardingCompleted: boolean }).onboardingCompleted
      }
      // Refresh user data from DB if available without crashing on network/offline errors
      if (token.id && !token.id.toString().startsWith('usr-')) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, onboardingCompleted: true, isActive: true, name: true, image: true },
          })
          if (dbUser) {
            token.role = dbUser.role
            token.onboardingCompleted = dbUser.onboardingCompleted
            token.name = dbUser.name
            token.picture = dbUser.image
          }
        } catch {
          // Keep existing token claims if DB is offline
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.onboardingCompleted = token.onboardingCompleted as boolean
      }
      return session
    },
  },
})

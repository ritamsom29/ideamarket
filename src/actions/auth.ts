'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { auth, signIn } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { UserRole, StartupStage } from '@prisma/client'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ENTREPRENEUR', 'INVESTOR', 'MENTOR']),
})

export async function registerUser(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
    }

    const validated = registerSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0].message }
    }

    const { name, email, password, role } = validated.data
    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existing) {
      return { success: false, error: 'An account with this email already exists' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: role as UserRole,
        isActive: true,
        onboardingCompleted: false,
      },
    })

    return {
      success: true,
      message: 'Account created successfully! You can now log in.',
      userId: user.id,
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during registration. Please try again.',
    }
  }
}

export async function completeOnboarding(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  const userId = session.user.id
  const role = session.user.role

  try {
    if (role === 'ENTREPRENEUR') {
      const bio = formData.get('bio') as string
      const location = formData.get('location') as string
      const phone = formData.get('phone') as string
      const linkedinUrl = formData.get('linkedinUrl') as string
      const yearsExperience = Number(formData.get('yearsExperience')) || 0
      const previousStartups = Number(formData.get('previousStartups')) || 0

      await prisma.entrepreneurProfile.upsert({
        where: { userId },
        create: {
          userId,
          bio,
          location,
          phone,
          linkedinUrl,
          yearsExperience,
          previousStartups,
        },
        update: {
          bio,
          location,
          phone,
          linkedinUrl,
          yearsExperience,
          previousStartups,
        },
      })
    } else if (role === 'INVESTOR') {
      const organization = formData.get('organization') as string
      const designation = formData.get('designation') as string
      const bio = formData.get('bio') as string
      const location = formData.get('location') as string
      const linkedinUrl = formData.get('linkedinUrl') as string
      const minInvestmentINR = BigInt(Number(formData.get('minInvestmentINR')) || 500000)
      const maxInvestmentINR = BigInt(Number(formData.get('maxInvestmentINR')) || 10000000)
      const investmentThesis = formData.get('investmentThesis') as string

      await prisma.investorProfile.upsert({
        where: { userId },
        create: {
          userId,
          organization,
          designation,
          bio,
          location,
          linkedinUrl,
          minInvestmentINR,
          maxInvestmentINR,
          investmentThesis,
          isProfilePublic: true,
        },
        update: {
          organization,
          designation,
          bio,
          location,
          linkedinUrl,
          minInvestmentINR,
          maxInvestmentINR,
          investmentThesis,
        },
      })
    } else if (role === 'MENTOR') {
      const headline = formData.get('headline') as string
      const bio = formData.get('bio') as string
      const location = formData.get('location') as string
      const linkedinUrl = formData.get('linkedinUrl') as string
      const yearsExperience = Number(formData.get('yearsExperience')) || 0
      const mentorshipFocus = formData.get('mentorshipFocus') as string

      await prisma.mentorProfile.upsert({
        where: { userId },
        create: {
          userId,
          headline,
          bio,
          location,
          linkedinUrl,
          yearsExperience,
          mentorshipFocus,
          isAvailable: true,
        },
        update: {
          headline,
          bio,
          location,
          linkedinUrl,
          yearsExperience,
          mentorshipFocus,
        },
      })
    }

    // Mark user onboarding completed
    await prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Onboarding error:', error)
    return { success: false, error: 'Failed to save onboarding details.' }
  }
}

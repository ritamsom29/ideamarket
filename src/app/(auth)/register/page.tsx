'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { registerUser } from '@/actions/auth'
import { signIn } from 'next-auth/react'
import { Lightbulb, Lock, Mail, User, ArrowRight, TrendingUp, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = (searchParams.get('role')?.toUpperCase() as 'ENTREPRENEUR' | 'INVESTOR' | 'MENTOR') || 'ENTREPRENEUR'

  const [role, setRole] = useState<'ENTREPRENEUR' | 'INVESTOR' | 'MENTOR'>(initialRole)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('role', role)

    try {
      const res = await registerUser(formData)
      if (res.success) {
        toast.success('Registration successful! Signing you in...')
        // Auto-login
        const loginRes = await signIn('credentials', {
          email: email.toLowerCase().trim(),
          password,
          redirect: false,
        })

        if (!loginRes?.error) {
          router.push('/onboarding')
          router.refresh()
        } else {
          router.push('/login')
        }
      } else {
        toast.error(res.error || 'Failed to create account.')
      }
    } catch {
      toast.error('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-2xl text-[#1e3a5f]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1e3a5f]">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
          </div>
          Idea Market
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-teal-600 hover:text-teal-700">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <Card className="border border-slate-200/80 shadow-md bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Select Your Account Type</CardTitle>
            <CardDescription className="text-xs">
              Choose your primary role to configure your ecosystem dashboard.
            </CardDescription>

            {/* Role Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 pt-3">
              <button
                type="button"
                onClick={() => setRole('ENTREPRENEUR')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  role === 'ENTREPRENEUR'
                    ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Lightbulb className="h-5 w-5 mx-auto mb-1.5" />
                <span className="text-xs font-bold block">Founder</span>
                <span className={`text-[10px] block mt-0.5 ${role === 'ENTREPRENEUR' ? 'text-slate-200' : 'text-slate-400'}`}>
                  Raise & scale
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole('INVESTOR')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  role === 'INVESTOR'
                    ? 'border-teal-700 bg-teal-700 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-700'
                }`}
              >
                <TrendingUp className="h-5 w-5 mx-auto mb-1.5" />
                <span className="text-xs font-bold block">Investor</span>
                <span className={`text-[10px] block mt-0.5 ${role === 'INVESTOR' ? 'text-teal-100' : 'text-slate-400'}`}>
                  Discover dealflow
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole('MENTOR')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  role === 'MENTOR'
                    ? 'border-emerald-700 bg-emerald-700 text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-700'
                }`}
              >
                <GraduationCap className="h-5 w-5 mx-auto mb-1.5" />
                <span className="text-xs font-bold block">Mentor</span>
                <span className={`text-[10px] block mt-0.5 ${role === 'MENTOR' ? 'text-emerald-100' : 'text-slate-400'}`}>
                  Guide founders
                </span>
              </button>
            </div>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="e.g. Priya Patel"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Work or Personal Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="priya@domain.in"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password (Minimum 8 characters)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-500 border border-slate-100 leading-relaxed">
                By registering, you agree to Idea Market's{' '}
                <Link href="/terms" className="text-teal-600 underline">Terms of Service</Link> and{' '}
                <Link href="/privacy" className="text-teal-600 underline">Privacy Policy</Link>.
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full bg-[#1e3a5f] hover:bg-[#0f2848] text-white shadow-sm font-semibold"
              >
                Continue to Onboarding
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]"></div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}

'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      })

      if (res?.error) {
        toast.error('Invalid email or password. Please try again.')
      } else {
        toast.success('Signed in successfully! Redirecting...')
        window.location.href = callbackUrl
      }
    } catch {
      toast.error('An unexpected error occurred during login.')
    } finally {
      setLoading(false)
    }
  }

  const selectDemoAccount = async (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('Password@123')
    setLoading(true)
    toast.info(`Signing in as ${demoEmail}...`)

    try {
      const res = await signIn('credentials', {
        email: demoEmail.toLowerCase().trim(),
        password: 'Password@123',
        redirect: false,
      })

      if (res?.error) {
        toast.error('Failed to authenticate demo account.')
      } else {
        toast.success('Signed in successfully! Redirecting...')
        window.location.href = callbackUrl
      }
    } catch {
      toast.error('An unexpected error occurred during login.')
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
          Sign in to your account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Or{' '}
          <Link href="/register" className="font-semibold text-teal-600 hover:text-teal-700">
            register for a new account
          </Link>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border border-slate-200/80 shadow-md bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Authentication</CardTitle>
            <CardDescription className="text-xs">
              Enter your registered email and password to access your dashboard.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="name@company.in"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="pl-9"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full bg-[#1e3a5f] hover:bg-[#0f2848] text-white shadow-sm font-semibold"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </form>

          {/* Quick Demo Accounts Selection */}
          <CardFooter className="flex flex-col border-t border-slate-100 pt-4 bg-slate-50/50 rounded-b-xl">
            <div className="w-full">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2.5">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                <span>One-Click Demo Credentials:</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => selectDemoAccount('aarav.sharma@payflow.in')}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:border-teal-500 text-left transition-all"
                >
                  <p className="font-semibold text-slate-800">Entrepreneur</p>
                  <p className="text-[10px] text-slate-500 truncate">Aarav (PayFlow)</p>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoAccount('rajesh.singhania@apexventures.in')}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:border-teal-500 text-left transition-all"
                >
                  <p className="font-semibold text-slate-800">Investor</p>
                  <p className="text-[10px] text-slate-500 truncate">Rajesh (Apex)</p>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoAccount('sanjay.mehta@scaleadvisors.in')}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:border-teal-500 text-left transition-all"
                >
                  <p className="font-semibold text-slate-800">Mentor</p>
                  <p className="text-[10px] text-slate-500 truncate">Sanjay (Advisor)</p>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoAccount('admin@ideamarket.in')}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:border-teal-500 text-left transition-all"
                >
                  <p className="font-semibold text-slate-800">Administrator</p>
                  <p className="text-[10px] text-slate-500 truncate">Platform Admin</p>
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400 mt-3">
                Default demo password: <code className="bg-slate-100 px-1 py-0.5 rounded">Password@123</code>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}

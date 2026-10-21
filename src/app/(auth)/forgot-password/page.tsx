'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success('Password reset instructions sent to your email.')
    }, 600)
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
          Reset Your Password
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border border-slate-200/80 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl">Account Recovery</CardTitle>
            <CardDescription className="text-xs">
              Enter your verified email and we'll send a password recovery token.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-900">Recovery Email Dispatched</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  If an account exists for <strong className="text-slate-800">{email}</strong>, check your inbox for instructions to reset your password.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full mt-4">
                  <Link href="/login">Return to Sign In</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Registered Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@company.in"
                      className="pl-9"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full bg-[#1e3a5f] hover:bg-[#0f2848] text-white"
                >
                  Send Reset Link
                </Button>

                <div className="text-center pt-2">
                  <Link href="/login" className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-2xl text-[#1e3a5f]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1e3a5f]">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
          </div>
          Idea Market
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border border-slate-200/80 shadow-md bg-white text-center p-6">
          <CardHeader className="pb-2">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
            <CardTitle className="text-xl">Email Verified Successfully</CardTitle>
            <CardDescription className="text-xs">
              Your email credentials have been confirmed for the Idea Market ecosystem.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button asChild className="w-full bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
              <Link href="/dashboard">
                Proceed to Dashboard <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

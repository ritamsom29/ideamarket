'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { expressInvestmentInterest } from '@/actions/interests'
import { toast } from 'sonner'
import { TrendingUp, AlertCircle } from 'lucide-react'

interface Props {
  startupId: string
  startupName: string
  isLoggedIn: boolean
  userRole?: string
}

export function ExpressInterestModal({ startupId, startupName, isLoggedIn, userRole }: Props) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOpen = () => {
    if (!isLoggedIn) {
      toast.error('Please sign in as an investor to express interest.')
      window.location.href = `/login?callbackUrl=/startups`
      return
    }
    if (userRole !== 'INVESTOR' && userRole !== 'ADMIN') {
      toast.error('Only registered investors can submit investment interest expressions.')
      return
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast.error('Please provide a brief introduction or investment query.')
      return
    }

    setLoading(true)
    try {
      const res = await expressInvestmentInterest(startupId, message)
      if (res.success) {
        toast.success(res.message || 'Investment interest expressed successfully!')
        setOpen(false)
        setMessage('')
      } else {
        toast.error(res.error || 'Failed to submit interest.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        size="lg"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-semibold"
      >
        <TrendingUp className="mr-2 h-5 w-5" />
        Express Investment Interest
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Express Interest in {startupName}</DialogTitle>
            <DialogDescription>
              Introduce your investment fund or angel syndicate and outline your preliminary evaluation goals.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Non-Binding Notice:</strong> Expressing interest does not constitute a legally binding investment commitment or financial contract.
              </span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">Introductory Note to Founders</Label>
              <Textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Example: Hello team, we represent [Fund] and are interested in learning more about your cohort retention metrics and cap table..."
                rows={4}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white"
              >
                Send Expression
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

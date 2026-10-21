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
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { requestMentorship } from '@/actions/mentorship'
import { toast } from 'sonner'
import { GraduationCap } from 'lucide-react'

interface Props {
  mentorUserId: string
  mentorName: string
  isLoggedIn: boolean
  isAvailable: boolean
}

export function RequestMentorshipModal({ mentorUserId, mentorName, isLoggedIn, isAvailable }: Props) {
  const [open, setOpen] = useState(false)
  const [goals, setGoals] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOpen = () => {
    if (!isLoggedIn) {
      toast.error('Please sign in to request mentorship.')
      window.location.href = `/login?callbackUrl=/mentors`
      return
    }
    if (!isAvailable) {
      toast.error('This mentor is currently at full mentee capacity.')
      return
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goals.trim() || !message.trim()) {
      toast.error('Please fill in both your mentorship goals and introduction.')
      return
    }

    setLoading(true)
    try {
      const res = await requestMentorship(mentorUserId, goals, message)
      if (res.success) {
        toast.success(res.message || 'Mentorship request submitted!')
        setOpen(false)
        setGoals('')
        setMessage('')
      } else {
        toast.error(res.error || 'Failed to submit request.')
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
        disabled={!isAvailable}
        size="sm"
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        <GraduationCap className="mr-1.5 h-4 w-4" />
        {isAvailable ? 'Request Mentorship' : 'Capacity Full'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Mentorship from {mentorName}</DialogTitle>
            <DialogDescription>
              Clearly explain your specific startup challenges and what guidance you are seeking.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="goals">Key Objectives & Goals</Label>
              <Input
                id="goals"
                value={goals}
                onChange={e => setGoals(e.target.value)}
                placeholder="e.g., Refining unit economics, regulatory compliance, hospital pilots..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">Introductory Message & Context</Label>
              <Textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Introduce yourself, your startup stage, and why you would value this mentor's guidance..."
                rows={4}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white"
              >
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

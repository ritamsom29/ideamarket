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
import { Label } from '@/components/ui/label'
import { sendConnectionRequest } from '@/actions/connections'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'

interface Props {
  investorUserId: string
  investorName: string
  isLoggedIn: boolean
}

export function ConnectInvestorModal({ investorUserId, investorName, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOpen = () => {
    if (!isLoggedIn) {
      toast.error('Please sign in to send connection requests.')
      window.location.href = `/login?callbackUrl=/investors`
      return
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await sendConnectionRequest(investorUserId, message)
      if (res.success) {
        toast.success(res.message || 'Connection request sent!')
        setOpen(false)
        setMessage('')
      } else {
        toast.error(res.error || 'Failed to send request.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={handleOpen} size="sm" className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
        <UserPlus className="mr-1.5 h-4 w-4" />
        Connect
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect with {investorName}</DialogTitle>
            <DialogDescription>
              Introduce your venture or startup background to establish an active direct connection.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="message">Personalized Connection Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Example: Hello, I am building an agritech venture in Madhya Pradesh and noticed your thesis in farm supply chains..."
                rows={3}
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
                Send Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { Mail, MapPin, Phone, MessageSquare, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success('Your message has been received! Our team will respond within 24 hours.')
    }, 600)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar user={null} />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-[#1e3a5f] tracking-tight">
              Get in Touch with Idea Market
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Have questions regarding verification, partnership inquiries, or platform feedback? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 bg-white border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-blue-50 text-[#1e3a5f]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email Address</p>
                    <p className="font-semibold text-slate-900 text-sm">support@ideamarket.in</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">For founder onboarding and verification queries.</p>
              </Card>

              <Card className="p-6 bg-white border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Headquarters</p>
                    <p className="font-semibold text-slate-900 text-sm">Indiranagar, Bengaluru</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Karnataka 560038, India</p>
              </Card>

              <Card className="p-6 bg-white border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Helpline</p>
                    <p className="font-semibold text-slate-900 text-sm">+91 (80) 4123-4567</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Monday - Friday, 9:30 AM to 6:30 PM IST</p>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8 bg-white border border-slate-200 shadow-sm">
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">Message Sent Successfully!</h3>
                    <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                      Thank you for contacting Idea Market. A member of our ecosystem team will review your inquiry and get back to you shortly.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="mt-6"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" required placeholder="Aarav Sharma" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" required placeholder="aarav@company.in" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input id="phone" placeholder="+91 98765 43210" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="subject">Inquiry Type</Label>
                        <select
                          id="subject"
                          className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                        >
                          <option>Founder Support & Listing</option>
                          <option>Investor Verification</option>
                          <option>Mentor Program Inquiry</option>
                          <option>Partnership & Ecosystem</option>
                          <option>Report Content / Concern</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea
                        id="message"
                        required
                        placeholder="Please describe how we can assist you..."
                        rows={5}
                      />
                    </div>

                    <Button
                      type="submit"
                      loading={loading}
                      className="w-full sm:w-auto bg-[#1e3a5f] hover:bg-[#0f2848] text-white px-8"
                    >
                      Send Message
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

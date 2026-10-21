import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Shield, Lock, Bell, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const session = await auth()
  const userId = session?.user?.id!

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a5f] tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your login credentials, notifications, and privacy preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Security & Credentials */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#1e3a5f]" />
              <CardTitle className="text-lg">Security & Password</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Change your password and manage session authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5 max-w-md">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" placeholder="••••••••" />
            </div>

            <div className="space-y-1.5 max-w-md">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" placeholder="••••••••" />
              <p className="text-[11px] text-slate-400">Must be at least 8 characters long.</p>
            </div>

            <Button size="sm" className="bg-[#1e3a5f] hover:bg-[#0f2848] text-white">
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Privacy & Discovery Settings */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-teal-600" />
              <CardTitle className="text-lg">Privacy & Profile Discovery</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Control your visibility across public directories.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-semibold text-slate-900 text-xs">Public Directory Listing</p>
                <p className="text-[11px] text-slate-500">Allow your verified profile to be discovered in search</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-[#1e3a5f]" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-semibold text-slate-900 text-xs">Email Activity Digests</p>
                <p className="text-[11px] text-slate-500">Receive daily summaries of new investor inquiries</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-[#1e3a5f]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

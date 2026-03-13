"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Save, School, Bell, Shield, Palette, Globe } from "lucide-react"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    schoolName: "G.L. International School",
    tagline: "Nurturing Minds, Building Futures",
    address: "123 Education Lane, Knowledge City",
    phone: "+91 9876543210",
    email: "info@glischool.edu",
    website: "www.glischool.edu",
    academicYear: "2025-26",
    principalName: "Dr. Rajesh Kumar",
    boardAffiliation: "CBSE",
    establishedYear: "1995"
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsAlerts: true,
    parentAppNotifications: true,
    attendanceAlerts: true,
    feeReminders: true,
    examNotifications: true
  })

  const [modules, setModules] = useState({
    attendance: true,
    homework: true,
    fees: true,
    exams: true,
    timetable: true,
    transport: false,
    library: false,
    hostel: false
  })

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage school configuration and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="general" className="gap-2">
            <School className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="modules" className="gap-2">
            <Globe className="h-4 w-4" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="academic" className="gap-2">
            <Shield className="h-4 w-4" />
            Academic
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Basic details about your institution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>School Name</Label>
                  <Input 
                    value={settings.schoolName}
                    onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tagline</Label>
                  <Input 
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Address</Label>
                <Textarea 
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input 
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input 
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Website</Label>
                  <Input 
                    value={settings.website}
                    onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Principal Name</Label>
                  <Input 
                    value={settings.principalName}
                    onChange={(e) => setSettings({ ...settings, principalName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Board Affiliation</Label>
                  <Select 
                    value={settings.boardAffiliation}
                    onValueChange={(v) => setSettings({ ...settings, boardAffiliation: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CBSE">CBSE</SelectItem>
                      <SelectItem value="ICSE">ICSE</SelectItem>
                      <SelectItem value="State">State Board</SelectItem>
                      <SelectItem value="IB">IB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Established Year</Label>
                  <Input 
                    value={settings.establishedYear}
                    onChange={(e) => setSettings({ ...settings, establishedYear: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send notifications via email</p>
                </div>
                <Switch 
                  checked={notifications.emailNotifications}
                  onCheckedChange={(v) => setNotifications({ ...notifications, emailNotifications: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Send critical alerts via SMS</p>
                </div>
                <Switch 
                  checked={notifications.smsAlerts}
                  onCheckedChange={(v) => setNotifications({ ...notifications, smsAlerts: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Parent App Notifications</Label>
                  <p className="text-sm text-muted-foreground">Push notifications to parent app</p>
                </div>
                <Switch 
                  checked={notifications.parentAppNotifications}
                  onCheckedChange={(v) => setNotifications({ ...notifications, parentAppNotifications: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Attendance Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify parents about attendance</p>
                </div>
                <Switch 
                  checked={notifications.attendanceAlerts}
                  onCheckedChange={(v) => setNotifications({ ...notifications, attendanceAlerts: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Fee Reminders</Label>
                  <p className="text-sm text-muted-foreground">Send fee due reminders</p>
                </div>
                <Switch 
                  checked={notifications.feeReminders}
                  onCheckedChange={(v) => setNotifications({ ...notifications, feeReminders: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Exam Notifications</Label>
                  <p className="text-sm text-muted-foreground">Notify about upcoming exams</p>
                </div>
                <Switch 
                  checked={notifications.examNotifications}
                  onCheckedChange={(v) => setNotifications({ ...notifications, examNotifications: v })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Settings</CardTitle>
              <CardDescription>Enable or disable ERP modules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Attendance Module</Label>
                    <p className="text-sm text-muted-foreground">Track student attendance</p>
                  </div>
                  <Switch 
                    checked={modules.attendance}
                    onCheckedChange={(v) => setModules({ ...modules, attendance: v })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Homework Module</Label>
                    <p className="text-sm text-muted-foreground">Assign and track homework</p>
                  </div>
                  <Switch 
                    checked={modules.homework}
                    onCheckedChange={(v) => setModules({ ...modules, homework: v })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Fees Module</Label>
                    <p className="text-sm text-muted-foreground">Fee collection and tracking</p>
                  </div>
                  <Switch 
                    checked={modules.fees}
                    onCheckedChange={(v) => setModules({ ...modules, fees: v })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Exams Module</Label>
                    <p className="text-sm text-muted-foreground">Exam scheduling and results</p>
                  </div>
                  <Switch 
                    checked={modules.exams}
                    onCheckedChange={(v) => setModules({ ...modules, exams: v })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Timetable Module</Label>
                    <p className="text-sm text-muted-foreground">Class timetable management</p>
                  </div>
                  <Switch 
                    checked={modules.timetable}
                    onCheckedChange={(v) => setModules({ ...modules, timetable: v })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Transport Module</Label>
                    <p className="text-sm text-muted-foreground">School transport tracking</p>
                  </div>
                  <Switch 
                    checked={modules.transport}
                    onCheckedChange={(v) => setModules({ ...modules, transport: v })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Library Module</Label>
                    <p className="text-sm text-muted-foreground">Library management</p>
                  </div>
                  <Switch 
                    checked={modules.library}
                    onCheckedChange={(v) => setModules({ ...modules, library: v })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label>Hostel Module</Label>
                    <p className="text-sm text-muted-foreground">Hostel management</p>
                  </div>
                  <Switch 
                    checked={modules.hostel}
                    onCheckedChange={(v) => setModules({ ...modules, hostel: v })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Settings</CardTitle>
              <CardDescription>Configure academic year and grading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Current Academic Year</Label>
                  <Select 
                    value={settings.academicYear}
                    onValueChange={(v) => setSettings({ ...settings, academicYear: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-26">2025-26</SelectItem>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Grading System</Label>
                  <Select defaultValue="grade">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grade">Grade Based (A+, A, B+...)</SelectItem>
                      <SelectItem value="percentage">Percentage Based</SelectItem>
                      <SelectItem value="cgpa">CGPA System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Passing Percentage</Label>
                  <Input type="number" defaultValue="33" />
                </div>
                <div className="grid gap-2">
                  <Label>Maximum Marks</Label>
                  <Input type="number" defaultValue="100" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-lg bg-primary" />
                    <Input defaultValue="#7C2D12" className="font-mono" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-lg bg-accent" />
                    <Input defaultValue="#CA8A04" className="font-mono" />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>School Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    <School className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline">Upload Logo</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

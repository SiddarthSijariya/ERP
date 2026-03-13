"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { Plus, Bell, Megaphone, AlertTriangle, Info, Trash2, Edit } from "lucide-react"
import { format } from "date-fns"

interface Notice {
  id: string
  title: string
  content: string
  type: string
  target_audience: string
  priority: string
  is_active: boolean
  publish_date: string
  expiry_date: string | null
  created_at: string
}

const priorityColors: Record<string, string> = {
  high: "bg-destructive text-destructive-foreground",
  medium: "bg-accent text-accent-foreground",
  low: "bg-secondary text-secondary-foreground"
}

const typeIcons: Record<string, typeof Bell> = {
  announcement: Megaphone,
  alert: AlertTriangle,
  info: Info,
  general: Bell
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    type: "general",
    target_audience: "all",
    priority: "medium"
  })
  const supabase = createClient()

  useEffect(() => {
    fetchNotices()
  }, [])

  async function fetchNotices() {
    setIsLoading(true)
    const { data } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setNotices(data)
    setIsLoading(false)
  }

  async function handleAddNotice() {
    const { error } = await supabase.from("notices").insert({
      ...newNotice,
      publish_date: new Date().toISOString(),
      is_active: true
    })

    if (!error) {
      setIsAddOpen(false)
      setNewNotice({ title: "", content: "", type: "general", target_audience: "all", priority: "medium" })
      fetchNotices()
    }
  }

  async function handleDeleteNotice(id: string) {
    await supabase.from("notices").delete().eq("id", id)
    fetchNotices()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notice Board</h1>
          <p className="text-muted-foreground">Manage school announcements and notices</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Notice</DialogTitle>
              <DialogDescription>Add a new notice or announcement</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input 
                  placeholder="Notice title"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Content</Label>
                <Textarea 
                  placeholder="Notice content..."
                  rows={4}
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select 
                    value={newNotice.type} 
                    onValueChange={(v) => setNewNotice({ ...newNotice, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="info">Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select 
                    value={newNotice.priority} 
                    onValueChange={(v) => setNewNotice({ ...newNotice, priority: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Target Audience</Label>
                <Select 
                  value={newNotice.target_audience} 
                  onValueChange={(v) => setNewNotice({ ...newNotice, target_audience: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="parents">Parents Only</SelectItem>
                    <SelectItem value="teachers">Teachers Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNotice}>Publish Notice</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Loading notices...
            </CardContent>
          </Card>
        ) : notices.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Notices Yet</h3>
              <p className="text-muted-foreground mb-4">Create your first notice to get started</p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Notice
              </Button>
            </CardContent>
          </Card>
        ) : (
          notices.map((notice) => {
            const Icon = typeIcons[notice.type] || Bell
            return (
              <Card key={notice.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{notice.title}</CardTitle>
                        <CardDescription>
                          Published {format(new Date(notice.publish_date), "dd MMM yyyy, hh:mm a")}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={priorityColors[notice.priority]}>
                        {notice.priority}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {notice.target_audience}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteNotice(notice.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{notice.content}</p>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

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
import { Plus, Calendar, MapPin, Clock, Users, Trash2, Edit } from "lucide-react"
import { format, isFuture, isPast, isToday } from "date-fns"

interface Event {
  id: string
  title: string
  description: string
  event_type: string
  start_date: string
  end_date: string | null
  location: string
  is_holiday: boolean
  created_at: string
}

const eventTypeColors: Record<string, string> = {
  academic: "bg-primary text-primary-foreground",
  sports: "bg-accent text-accent-foreground",
  cultural: "bg-chart-2 text-primary-foreground",
  holiday: "bg-destructive text-destructive-foreground",
  exam: "bg-chart-5 text-primary-foreground",
  meeting: "bg-secondary text-secondary-foreground"
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_type: "academic",
    start_date: "",
    end_date: "",
    location: "",
    is_holiday: false
  })
  const supabase = createClient()

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    setIsLoading(true)
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true })

    if (data) setEvents(data)
    setIsLoading(false)
  }

  async function handleAddEvent() {
    const { error } = await supabase.from("events").insert({
      ...newEvent,
      end_date: newEvent.end_date || null
    })

    if (!error) {
      setIsAddOpen(false)
      setNewEvent({
        title: "",
        description: "",
        event_type: "academic",
        start_date: "",
        end_date: "",
        location: "",
        is_holiday: false
      })
      fetchEvents()
    }
  }

  async function handleDeleteEvent(id: string) {
    await supabase.from("events").delete().eq("id", id)
    fetchEvents()
  }

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true
    if (filter === "upcoming") return isFuture(new Date(event.start_date))
    if (filter === "past") return isPast(new Date(event.start_date))
    return event.event_type === filter
  })

  const upcomingEvents = events.filter((e) => isFuture(new Date(e.start_date)) || isToday(new Date(e.start_date)))
  const todayEvents = events.filter((e) => isToday(new Date(e.start_date)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events & Calendar</h1>
          <p className="text-muted-foreground">Manage school events and activities</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>Add a new event or activity</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Event Title</Label>
                <Input 
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Event description..."
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Event Type</Label>
                  <Select 
                    value={newEvent.event_type} 
                    onValueChange={(v) => setNewEvent({ ...newEvent, event_type: v, is_holiday: v === "holiday" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="exam">Examination</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Location</Label>
                  <Input 
                    placeholder="Event location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Input 
                    type="datetime-local"
                    value={newEvent.start_date}
                    onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>End Date (Optional)</Label>
                  <Input 
                    type="datetime-local"
                    value={newEvent.end_date}
                    onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">Events scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{todayEvents.length}</div>
            <p className="text-xs text-muted-foreground">Events happening today</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
            <SelectItem value="holiday">Holidays</SelectItem>
            <SelectItem value="exam">Examinations</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              Loading events...
            </CardContent>
          </Card>
        ) : filteredEvents.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
              <p className="text-muted-foreground mb-4">Create your first event to get started</p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className={event.is_holiday ? "border-destructive/50" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge className={eventTypeColors[event.event_type] || "bg-secondary"}>
                    {event.event_type}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2">{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.start_date), "EEE, dd MMM yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(event.start_date), "hh:mm a")}</span>
                    {event.end_date && (
                      <span>- {format(new Date(event.end_date), "hh:mm a")}</span>
                    )}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

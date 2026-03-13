import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Clock } from 'lucide-react'
import type { Event } from '@/lib/types'

interface UpcomingEventsProps {
  events: Event[]
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Events
        </CardTitle>
        <CardDescription>School events and activities</CardDescription>
      </CardHeader>
      <CardContent>
        {events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
              >
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground">
                  <span className="text-xs font-medium">
                    {new Date(event.event_date).toLocaleDateString('en-IN', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold leading-none">
                    {new Date(event.event_date).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{event.title}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    {event.start_time && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {event.start_time}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No upcoming events</p>
        )}
      </CardContent>
    </Card>
  )
}

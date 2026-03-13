import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  BookOpen, 
  ClipboardCheck,
  BookOpenCheck,
  Calendar,
  Clock
} from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { UpcomingEvents } from '@/components/dashboard/upcoming-events'

export default async function TeacherDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: teacherData } = await supabase
    .from('teachers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get teacher's classes and subjects
  const { data: subjects } = await supabase
    .from('subjects')
    .select(`
      *,
      classes:class_id (name, section)
    `)
    .eq('teacher_id', teacherData?.id)

  // Get today's timetable
  const dayOfWeek = new Date().getDay()
  const { data: todaySchedule } = await supabase
    .from('timetable')
    .select(`
      *,
      subjects:subject_id (name),
      classes:class_id (name, section)
    `)
    .eq('teacher_id', teacherData?.id)
    .eq('day_of_week', dayOfWeek)
    .order('start_time')

  // Get upcoming events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString().split('T')[0])
    .order('event_date')
    .limit(5)

  // Get pending homework assignments
  const { data: pendingHomework } = await supabase
    .from('homework')
    .select(`
      *,
      subjects:subject_id (name),
      classes:class_id (name, section)
    `)
    .eq('teacher_id', teacherData?.id)
    .gte('due_date', new Date().toISOString().split('T')[0])
    .order('due_date')
    .limit(5)

  const stats = [
    {
      title: 'My Classes',
      value: subjects?.length || 0,
      icon: BookOpen,
      description: 'Assigned subjects'
    },
    {
      title: 'Today\'s Classes',
      value: todaySchedule?.length || 0,
      icon: Clock,
      description: 'Scheduled today'
    },
    {
      title: 'Pending Homework',
      value: pendingHomework?.length || 0,
      icon: BookOpenCheck,
      description: 'To be reviewed'
    },
    {
      title: 'Attendance',
      value: '95%',
      icon: ClipboardCheck,
      description: 'Average this month'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {profile?.full_name?.split(' ')[0] || 'Teacher'}</h1>
        <p className="text-muted-foreground">Here&apos;s your teaching overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Today's Schedule and Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today&apos;s Schedule
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todaySchedule && todaySchedule.length > 0 ? (
              <div className="space-y-3">
                {todaySchedule.map((schedule) => (
                  <div 
                    key={schedule.id} 
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="text-center min-w-[80px]">
                      <p className="text-sm font-medium">{schedule.start_time}</p>
                      <p className="text-xs text-muted-foreground">{schedule.end_time}</p>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div className="flex-1">
                      <p className="font-medium">{schedule.subjects?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {schedule.classes?.name} - {schedule.classes?.section}
                        {schedule.room && ` | Room ${schedule.room}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No classes scheduled for today
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pending Homework */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5 text-primary" />
              Active Homework
            </CardTitle>
            <CardDescription>Assignments due soon</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingHomework && pendingHomework.length > 0 ? (
              <div className="space-y-3">
                {pendingHomework.map((hw) => (
                  <div 
                    key={hw.id} 
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground text-center">
                      <span className="text-xs">
                        {new Date(hw.due_date).toLocaleDateString('en-IN', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold leading-none">
                        {new Date(hw.due_date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{hw.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {hw.subjects?.name} | {hw.classes?.name} - {hw.classes?.section}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No pending homework assignments
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Subjects and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Subjects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              My Subjects
            </CardTitle>
            <CardDescription>Classes you are teaching</CardDescription>
          </CardHeader>
          <CardContent>
            {subjects && subjects.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {subjects.map((subject) => (
                  <div 
                    key={subject.id} 
                    className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <p className="font-medium text-sm">{subject.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {subject.classes?.name} - {subject.classes?.section}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No subjects assigned yet
              </p>
            )}
          </CardContent>
        </Card>

        <UpcomingEvents events={events || []} />
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  GraduationCap, 
  BookOpen, 
  ClipboardCheck,
  BookOpenCheck,
  Calendar,
  Clock,
  FileText,
  TrendingUp
} from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { UpcomingEvents } from '@/components/dashboard/upcoming-events'

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: studentData } = await supabase
    .from('students')
    .select(`
      *,
      classes:class_id (
        id,
        name,
        section,
        academic_year
      )
    `)
    .eq('user_id', user.id)
    .single()

  // Get student's subjects
  const { data: subjects } = await supabase
    .from('subjects')
    .select(`
      *,
      teachers:teacher_id (
        profiles:user_id (full_name)
      )
    `)
    .eq('class_id', studentData?.class_id)

  // Get today's timetable
  const dayOfWeek = new Date().getDay()
  const { data: todaySchedule } = await supabase
    .from('timetable')
    .select(`
      *,
      subjects:subject_id (name),
      teachers:teacher_id (
        profiles:user_id (full_name)
      )
    `)
    .eq('class_id', studentData?.class_id)
    .eq('day_of_week', dayOfWeek)
    .order('start_time')

  // Get pending homework
  const { data: pendingHomework } = await supabase
    .from('homework')
    .select(`
      *,
      subjects:subject_id (name)
    `)
    .eq('class_id', studentData?.class_id)
    .gte('due_date', new Date().toISOString().split('T')[0])
    .order('due_date')
    .limit(5)

  // Get upcoming events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString().split('T')[0])
    .order('event_date')
    .limit(5)

  // Get recent attendance
  const { data: recentAttendance } = await supabase
    .from('attendance')
    .select('*')
    .eq('student_id', studentData?.id)
    .order('date', { ascending: false })
    .limit(30)

  const presentDays = recentAttendance?.filter(a => a.status === 'present').length || 0
  const totalDays = recentAttendance?.length || 1
  const attendanceRate = Math.round((presentDays / totalDays) * 100)

  const stats = [
    {
      title: 'My Class',
      value: studentData?.classes?.name || 'N/A',
      icon: GraduationCap,
      description: `Section ${studentData?.classes?.section || 'N/A'}`
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
      description: 'Due soon'
    },
    {
      title: 'Attendance',
      value: `${attendanceRate}%`,
      icon: ClipboardCheck,
      description: 'Last 30 days',
      trend: { value: attendanceRate >= 90 ? 5 : -3, isPositive: attendanceRate >= 90 }
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary">
          <span className="text-2xl font-bold text-primary-foreground">
            {profile?.full_name?.charAt(0).toUpperCase() || 'S'}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, {profile?.full_name?.split(' ')[0] || 'Student'}</h1>
          <p className="text-muted-foreground">
            {studentData?.classes?.name} - Section {studentData?.classes?.section} | {studentData?.classes?.academic_year}
          </p>
        </div>
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
                {todaySchedule.map((schedule, index) => (
                  <div 
                    key={schedule.id} 
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="text-center min-w-[70px]">
                      <p className="text-sm font-medium">{schedule.start_time}</p>
                      <p className="text-xs text-muted-foreground">{schedule.end_time}</p>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div className="flex-1">
                      <p className="font-medium">{schedule.subjects?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {schedule.teachers?.profiles?.full_name || 'TBA'}
                        {schedule.room && ` | Room ${schedule.room}`}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Period {index + 1}
                    </Badge>
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
              Pending Homework
            </CardTitle>
            <CardDescription>Assignments due soon</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingHomework && pendingHomework.length > 0 ? (
              <div className="space-y-3">
                {pendingHomework.map((hw) => {
                  const dueDate = new Date(hw.due_date)
                  const today = new Date()
                  const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                  
                  return (
                    <div 
                      key={hw.id} 
                      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground text-center">
                        <span className="text-xs">
                          {dueDate.toLocaleDateString('en-IN', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold leading-none">
                          {dueDate.getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{hw.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {hw.subjects?.name}
                        </p>
                      </div>
                      <Badge 
                        variant={daysLeft <= 1 ? 'destructive' : daysLeft <= 3 ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days`}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No pending homework
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subjects and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Subjects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              My Subjects
            </CardTitle>
            <CardDescription>Subjects for this academic year</CardDescription>
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
                      {subject.teachers?.profiles?.full_name || 'TBA'}
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

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  CreditCard,
  TrendingUp,
  TrendingDown,
  Calendar,
  Bell
} from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { UpcomingEvents } from '@/components/dashboard/upcoming-events'
import { AttendanceChart } from '@/components/dashboard/attendance-chart'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch dashboard statistics
  const [
    { count: studentCount },
    { count: teacherCount },
    { count: classCount },
    { data: events },
    { data: notices },
    { data: recentPayments }
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('teachers').select('*', { count: 'exact', head: true }),
    supabase.from('classes').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*').gte('event_date', new Date().toISOString().split('T')[0]).order('event_date').limit(5),
    supabase.from('notices').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(5),
    supabase.from('fee_payments').select('*, students(user_id, profiles:user_id(full_name))').order('created_at', { ascending: false }).limit(5)
  ])

  const stats = [
    {
      title: 'Total Students',
      value: studentCount || 0,
      icon: Users,
      trend: { value: 12, isPositive: true },
      description: 'Active enrollments'
    },
    {
      title: 'Total Teachers',
      value: teacherCount || 0,
      icon: UserCheck,
      trend: { value: 3, isPositive: true },
      description: 'Teaching staff'
    },
    {
      title: 'Total Classes',
      value: classCount || 0,
      icon: BookOpen,
      trend: { value: 0, isPositive: true },
      description: 'Active classes'
    },
    {
      title: 'Fee Collection',
      value: '₹2.5L',
      icon: CreditCard,
      trend: { value: 8, isPositive: true },
      description: 'This month'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your school.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Recent Notices
            </CardTitle>
            <CardDescription>Latest announcements and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {notices && notices.length > 0 ? (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div key={notice.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{notice.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{notice.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No recent notices</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Events and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingEvents events={events || []} />
        <RecentActivity />
      </div>
    </div>
  )
}

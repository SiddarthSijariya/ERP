import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  BookOpen, 
  ClipboardCheck,
  CreditCard,
  Bell,
  Calendar,
  FileText,
  ChevronRight
} from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { UpcomingEvents } from '@/components/dashboard/upcoming-events'
import Link from 'next/link'

export default async function ParentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get children (students linked to this parent)
  const { data: children } = await supabase
    .from('students')
    .select(`
      *,
      profiles:user_id (full_name, email),
      classes:class_id (name, section, academic_year)
    `)
    .eq('parent_id', user.id)

  // Get upcoming events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString().split('T')[0])
    .order('event_date')
    .limit(5)

  // Get notices for parents
  const { data: notices } = await supabase
    .from('notices')
    .select('*')
    .eq('is_published', true)
    .or('target_role.eq.parents,target_role.eq.all')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get pending fee payments for children
  const childIds = children?.map(c => c.id) || []
  const { data: pendingFees } = childIds.length > 0 ? await supabase
    .from('fee_payments')
    .select(`
      *,
      fee_structures:fee_structure_id (name, amount, due_date),
      students:student_id (
        profiles:user_id (full_name)
      )
    `)
    .in('student_id', childIds)
    .eq('status', 'pending')
    .order('created_at', { ascending: false }) : { data: [] }

  const stats = [
    {
      title: 'Children',
      value: children?.length || 0,
      icon: Users,
      description: 'Enrolled students'
    },
    {
      title: 'Attendance',
      value: '94%',
      icon: ClipboardCheck,
      description: 'Average this month'
    },
    {
      title: 'Pending Fees',
      value: `₹${(pendingFees?.reduce((sum, f) => sum + (f.fee_structures?.amount || 0), 0) || 0).toLocaleString()}`,
      icon: CreditCard,
      description: 'Due amount'
    },
    {
      title: 'Notices',
      value: notices?.length || 0,
      icon: Bell,
      description: 'Unread messages'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {profile?.full_name?.split(' ')[0] || 'Parent'}</h1>
        <p className="text-muted-foreground">Stay updated with your children&apos;s progress and school activities.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Children Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            My Children
          </CardTitle>
          <CardDescription>Overview of your enrolled children</CardDescription>
        </CardHeader>
        <CardContent>
          {children && children.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map((child) => (
                <div 
                  key={child.id} 
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary">
                      <span className="text-lg font-bold text-primary-foreground">
                        {child.profiles?.full_name?.charAt(0).toUpperCase() || 'S'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{child.profiles?.full_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {child.classes?.name} - Section {child.classes?.section}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Admission: {child.admission_number}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Link href={`/dashboard/parent/child/${child.id}/attendance`}>
                          <Button variant="outline" size="sm">
                            <ClipboardCheck className="w-3 h-3 mr-1" />
                            Attendance
                          </Button>
                        </Link>
                        <Link href={`/dashboard/parent/child/${child.id}/results`}>
                          <Button variant="outline" size="sm">
                            <FileText className="w-3 h-3 mr-1" />
                            Results
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No children linked to your account</p>
              <p className="text-sm text-muted-foreground mt-1">Please contact the school administration</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notices and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Recent Notices
                </CardTitle>
                <CardDescription>Important announcements</CardDescription>
              </div>
              <Link href="/dashboard/parent/notices">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {notices && notices.length > 0 ? (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div key={notice.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notice.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{notice.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notice.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No recent notices</p>
            )}
          </CardContent>
        </Card>

        <UpcomingEvents events={events || []} />
      </div>

      {/* Fee Payments */}
      {pendingFees && pendingFees.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Pending Fee Payments
                </CardTitle>
                <CardDescription>Outstanding fee dues</CardDescription>
              </div>
              <Link href="/dashboard/parent/fees">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingFees.map((fee) => (
                <div 
                  key={fee.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div>
                    <p className="font-medium text-sm">{fee.fee_structures?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {fee.students?.profiles?.full_name} | Due: {new Date(fee.fee_structures?.due_date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">₹{fee.fee_structures?.amount?.toLocaleString()}</p>
                    <Button variant="outline" size="sm" className="mt-1 bg-transparent">
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

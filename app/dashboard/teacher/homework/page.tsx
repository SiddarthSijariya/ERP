import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpenCheck, 
  Plus, 
  Calendar,
  FileText,
  Users
} from 'lucide-react'
import { AddHomeworkDialog } from '@/components/dashboard/add-homework-dialog'

export default async function TeacherHomeworkPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: teacherData } = await supabase
    .from('teachers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: homework } = await supabase
    .from('homework')
    .select(`
      *,
      subjects:subject_id (name, code),
      classes:class_id (name, section),
      submissions:homework_submissions(count)
    `)
    .eq('teacher_id', teacherData?.id)
    .order('created_at', { ascending: false })

  const { data: subjects } = await supabase
    .from('subjects')
    .select('*, classes:class_id(name, section)')
    .eq('teacher_id', teacherData?.id)

  const { data: classes } = await supabase
    .from('classes')
    .select('*')
    .order('name')

  const today = new Date().toISOString().split('T')[0]
  const activeHomework = homework?.filter(h => h.due_date >= today) || []
  const pastHomework = homework?.filter(h => h.due_date < today) || []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Homework</h1>
          <p className="text-muted-foreground">Create and manage homework assignments</p>
        </div>
        <AddHomeworkDialog subjects={subjects || []} classes={classes || []} teacherId={teacherData?.id}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Homework
          </Button>
        </AddHomeworkDialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <BookOpenCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{homework?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Assignments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeHomework.length}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pastHomework.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Homework */}
      <Card>
        <CardHeader>
          <CardTitle>Active Assignments</CardTitle>
          <CardDescription>Homework with upcoming due dates</CardDescription>
        </CardHeader>
        <CardContent>
          {activeHomework.length > 0 ? (
            <div className="space-y-4">
              {activeHomework.map((hw) => (
                <div 
                  key={hw.id} 
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-primary text-primary-foreground text-center">
                    <span className="text-xs">
                      {new Date(hw.due_date).toLocaleDateString('en-IN', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold leading-none">
                      {new Date(hw.due_date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium">{hw.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {hw.subjects?.name} | {hw.classes?.name} - {hw.classes?.section}
                        </p>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {hw.submissions?.[0]?.count || 0} submissions
                      </Badge>
                    </div>
                    {hw.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {hw.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">View Submissions</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No active homework assignments
            </p>
          )}
        </CardContent>
      </Card>

      {/* Past Homework */}
      {pastHomework.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past Assignments</CardTitle>
            <CardDescription>Completed homework</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastHomework.slice(0, 5).map((hw) => (
                <div 
                  key={hw.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="font-medium text-sm">{hw.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {hw.subjects?.name} | Due: {new Date(hw.due_date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {hw.submissions?.[0]?.count || 0} submissions
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

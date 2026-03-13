import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  Download
} from 'lucide-react'
import { StudentsTable } from '@/components/dashboard/students-table'
import { AddStudentDialog } from '@/components/dashboard/add-student-dialog'

export default async function StudentsPage() {
  const supabase = await createClient()

  const { data: students, error } = await supabase
    .from('students')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        email,
        phone,
        avatar_url
      ),
      classes:class_id (
        id,
        name,
        section
      )
    `)
    .order('created_at', { ascending: false })

  const { data: classes } = await supabase
    .from('classes')
    .select('*')
    .order('name')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage student information and enrollments</p>
        </div>
        <AddStudentDialog classes={classes || []}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </AddStudentDialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{students?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{students?.filter(s => s.gender === 'male').length || 0}</p>
                <p className="text-sm text-muted-foreground">Male Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-pink-100">
                <Users className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{students?.filter(s => s.gender === 'female').length || 0}</p>
                <p className="text-sm text-muted-foreground">Female Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{classes?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Classes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Student Directory</CardTitle>
              <CardDescription>View and manage all enrolled students</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search students..."
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StudentsTable students={students || []} />
        </CardContent>
      </Card>
    </div>
  )
}

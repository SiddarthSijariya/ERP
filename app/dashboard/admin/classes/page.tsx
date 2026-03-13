import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Plus, 
  Users,
  UserCheck
} from 'lucide-react'

export default async function ClassesPage() {
  const supabase = await createClient()

  const { data: classes } = await supabase
    .from('classes')
    .select(`
      *,
      students:students(count),
      class_teacher:class_teacher_id (
        id,
        profiles:user_id (full_name)
      )
    `)
    .order('name')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classes</h1>
          <p className="text-muted-foreground">Manage classes and sections</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{classes?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Classes</p>
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
                <p className="text-2xl font-bold">
                  {classes?.reduce((acc, c) => acc + (c.students?.[0]?.count || 0), 0) || 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20">
                <UserCheck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {classes?.filter(c => c.class_teacher_id).length || 0}
                </p>
                <p className="text-sm text-muted-foreground">With Class Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {classes?.map((cls) => (
          <Card key={cls.id} className="border-border hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{cls.name}</CardTitle>
                <Badge variant="outline">{cls.section}</Badge>
              </div>
              <CardDescription>{cls.academic_year}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-medium">{cls.students?.[0]?.count || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Class Teacher</span>
                  <span className="font-medium truncate max-w-[120px]">
                    {cls.class_teacher?.profiles?.full_name || 'Not assigned'}
                  </span>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!classes || classes.length === 0) && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No classes found</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first class to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

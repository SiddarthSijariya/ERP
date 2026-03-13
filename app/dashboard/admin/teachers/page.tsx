import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  UserCheck, 
  Plus, 
  Search,
  Filter,
  Mail,
  Phone
} from 'lucide-react'

export default async function TeachersPage() {
  const supabase = await createClient()

  const { data: teachers } = await supabase
    .from('teachers')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        email,
        phone,
        avatar_url,
        is_active
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground">Manage teaching staff and their assignments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{teachers?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{teachers?.filter(t => t.profiles?.is_active).length || 0}</p>
                <p className="text-sm text-muted-foreground">Active</p>
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
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Teacher Directory</CardTitle>
              <CardDescription>All teaching staff members</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search teachers..."
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {teachers && teachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((teacher) => (
                <Card key={teacher.id} className="border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-medium text-primary">
                          {teacher.profiles?.full_name?.charAt(0).toUpperCase() || 'T'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-foreground truncate">
                            {teacher.profiles?.full_name || 'Unknown'}
                          </h3>
                          <Badge 
                            variant={teacher.profiles?.is_active ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {teacher.profiles?.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{teacher.department || 'General'}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {teacher.employee_id}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          {teacher.profiles?.email && (
                            <a href={`mailto:${teacher.profiles.email}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                              <Mail className="w-3 h-3" />
                              Email
                            </a>
                          )}
                          {teacher.profiles?.phone && (
                            <a href={`tel:${teacher.profiles.phone}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                              <Phone className="w-3 h-3" />
                              Call
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No teachers found</p>
              <p className="text-sm text-muted-foreground mt-1">Add your first teacher to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

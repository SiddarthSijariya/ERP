'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'

interface Student {
  id: string
  admission_number: string
  roll_number?: string
  gender?: string
  date_of_birth?: string
  profiles?: {
    id: string
    full_name: string
    email: string
    phone?: string
    avatar_url?: string
  }
  classes?: {
    id: string
    name: string
    section: string
  }
}

interface StudentsTableProps {
  students: Student[]
}

export function StudentsTable({ students }: StudentsTableProps) {
  if (!students || students.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No students found</p>
        <p className="text-sm text-muted-foreground mt-1">Add your first student to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Admission No.</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {student.profiles?.full_name?.charAt(0).toUpperCase() || 'S'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{student.profiles?.full_name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{student.profiles?.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{student.admission_number}</Badge>
              </TableCell>
              <TableCell>
                {student.classes ? (
                  <span>{student.classes.name} - {student.classes.section}</span>
                ) : (
                  <span className="text-muted-foreground">Not assigned</span>
                )}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary"
                  className={student.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}
                >
                  {student.gender || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell>
                {student.profiles?.phone || '-'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

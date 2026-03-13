'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'

interface AttendanceRecord {
  id: string
  status: 'present' | 'absent' | 'late' | 'excused'
  remarks?: string
  students?: {
    id: string
    admission_number: string
    profiles?: {
      full_name: string
    }
  }
  classes?: {
    name: string
    section: string
  }
}

interface AttendanceTableProps {
  attendance: AttendanceRecord[]
}

const statusConfig = {
  present: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Present' },
  absent: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Absent' },
  late: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Late' },
  excused: { icon: AlertCircle, color: 'bg-blue-100 text-blue-700', label: 'Excused' }
}

export function AttendanceTable({ attendance }: AttendanceTableProps) {
  if (!attendance || attendance.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No attendance records for today</p>
        <p className="text-sm text-muted-foreground mt-1">Select a class and mark attendance to get started</p>
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
            <TableHead>Status</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record) => {
            const config = statusConfig[record.status]
            const StatusIcon = config.icon

            return (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {record.students?.profiles?.full_name?.charAt(0).toUpperCase() || 'S'}
                      </span>
                    </div>
                    <span className="font-medium">
                      {record.students?.profiles?.full_name || 'Unknown'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{record.students?.admission_number}</Badge>
                </TableCell>
                <TableCell>
                  {record.classes ? (
                    <span>{record.classes.name} - {record.classes.section}</span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={config.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {record.remarks || '-'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

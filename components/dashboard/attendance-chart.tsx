'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardCheck } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { day: 'Mon', attendance: 95 },
  { day: 'Tue', attendance: 92 },
  { day: 'Wed', attendance: 88 },
  { day: 'Thu', attendance: 94 },
  { day: 'Fri', attendance: 91 },
  { day: 'Sat', attendance: 85 },
]

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          Weekly Attendance
        </CardTitle>
        <CardDescription>Attendance percentage over the week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.35 0.12 25)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.35 0.12 25)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 85)" />
              <XAxis 
                dataKey="day" 
                stroke="oklch(0.45 0.02 30)"
                fontSize={12}
              />
              <YAxis 
                domain={[80, 100]} 
                stroke="oklch(0.45 0.02 30)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'oklch(1 0 0)',
                  border: '1px solid oklch(0.88 0.02 85)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'oklch(0.2 0.02 30)' }}
              />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="oklch(0.35 0.12 25)"
                strokeWidth={2}
                fill="url(#attendanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

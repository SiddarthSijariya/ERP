"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const periods = [
  { id: 1, time: "8:00 - 8:45", label: "Period 1" },
  { id: 2, time: "8:45 - 9:30", label: "Period 2" },
  { id: 3, time: "9:30 - 10:15", label: "Period 3" },
  { id: 4, time: "10:15 - 10:30", label: "Break" },
  { id: 5, time: "10:30 - 11:15", label: "Period 4" },
  { id: 6, time: "11:15 - 12:00", label: "Period 5" },
  { id: 7, time: "12:00 - 12:45", label: "Period 6" },
  { id: 8, time: "12:45 - 1:30", label: "Lunch" },
  { id: 9, time: "1:30 - 2:15", label: "Period 7" },
  { id: 10, time: "2:15 - 3:00", label: "Period 8" },
]

const timetableData: Record<string, Record<number, { subject: string; class: string; room: string } | null>> = {
  Monday: {
    1: { subject: "Mathematics", class: "Class 10-A", room: "Room 201" },
    2: { subject: "Mathematics", class: "Class 9-B", room: "Room 105" },
    3: { subject: "Mathematics", class: "Class 8-A", room: "Room 108" },
    5: { subject: "Mathematics", class: "Class 10-B", room: "Room 202" },
    6: { subject: "Mathematics", class: "Class 7-A", room: "Room 110" },
    9: { subject: "Mathematics", class: "Class 6-A", room: "Room 112" },
    10: null,
  },
  Tuesday: {
    1: { subject: "Mathematics", class: "Class 9-A", room: "Room 104" },
    2: { subject: "Mathematics", class: "Class 10-A", room: "Room 201" },
    3: null,
    5: { subject: "Mathematics", class: "Class 8-B", room: "Room 109" },
    6: { subject: "Mathematics", class: "Class 10-B", room: "Room 202" },
    9: { subject: "Mathematics", class: "Class 7-B", room: "Room 111" },
    10: { subject: "Mathematics", class: "Class 6-B", room: "Room 113" },
  },
  Wednesday: {
    1: { subject: "Mathematics", class: "Class 8-A", room: "Room 108" },
    2: { subject: "Mathematics", class: "Class 7-A", room: "Room 110" },
    3: { subject: "Mathematics", class: "Class 10-A", room: "Room 201" },
    5: { subject: "Mathematics", class: "Class 9-A", room: "Room 104" },
    6: null,
    9: { subject: "Mathematics", class: "Class 10-B", room: "Room 202" },
    10: { subject: "Mathematics", class: "Class 9-B", room: "Room 105" },
  },
  Thursday: {
    1: { subject: "Mathematics", class: "Class 6-A", room: "Room 112" },
    2: { subject: "Mathematics", class: "Class 6-B", room: "Room 113" },
    3: { subject: "Mathematics", class: "Class 9-B", room: "Room 105" },
    5: { subject: "Mathematics", class: "Class 7-A", room: "Room 110" },
    6: { subject: "Mathematics", class: "Class 8-A", room: "Room 108" },
    9: null,
    10: { subject: "Mathematics", class: "Class 10-A", room: "Room 201" },
  },
  Friday: {
    1: { subject: "Mathematics", class: "Class 10-B", room: "Room 202" },
    2: { subject: "Mathematics", class: "Class 8-B", room: "Room 109" },
    3: { subject: "Mathematics", class: "Class 7-B", room: "Room 111" },
    5: { subject: "Mathematics", class: "Class 6-A", room: "Room 112" },
    6: { subject: "Mathematics", class: "Class 9-A", room: "Room 104" },
    9: { subject: "Mathematics", class: "Class 8-A", room: "Room 108" },
    10: null,
  },
  Saturday: {
    1: { subject: "Mathematics", class: "Class 10-A", room: "Room 201" },
    2: { subject: "Mathematics", class: "Class 10-B", room: "Room 202" },
    3: null,
    5: null,
    6: null,
    9: null,
    10: null,
  },
}

export default function TimetablePage() {
  const [selectedDay, setSelectedDay] = useState("Monday")
  const todaySchedule = timetableData[selectedDay] || {}

  const totalClasses = Object.values(timetableData).reduce((acc, day) => {
    return acc + Object.values(day).filter(Boolean).length
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Timetable</h1>
          <p className="text-muted-foreground">Your weekly class schedule</p>
        </div>
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">Total periods this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {Object.values(todaySchedule).filter(Boolean).length}
            </div>
            <p className="text-xs text-muted-foreground">Classes on {selectedDay}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">Mathematics</div>
            <p className="text-xs text-muted-foreground">Primary subject</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{selectedDay} Schedule</CardTitle>
          <CardDescription>Your classes for {selectedDay}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {periods.map((period) => {
              const isBreak = period.label === "Break" || period.label === "Lunch"
              const classInfo = !isBreak ? todaySchedule[period.id] : null

              return (
                <div
                  key={period.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    isBreak
                      ? "bg-muted/50 border-dashed"
                      : classInfo
                        ? "bg-primary/5 border-primary/20"
                        : "bg-background"
                  }`}
                >
                  <div className="w-24 text-sm">
                    <div className="font-medium">{period.label}</div>
                    <div className="text-muted-foreground text-xs">{period.time}</div>
                  </div>
                  {isBreak ? (
                    <div className="flex-1 text-center text-muted-foreground">
                      {period.label}
                    </div>
                  ) : classInfo ? (
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{classInfo.subject}</div>
                        <div className="text-sm text-muted-foreground">{classInfo.class}</div>
                      </div>
                      <Badge variant="outline">{classInfo.room}</Badge>
                    </div>
                  ) : (
                    <div className="flex-1 text-muted-foreground text-sm">Free Period</div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Quick view of your entire week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Time</th>
                  {days.map((day) => (
                    <th key={day} className="text-left p-2 font-medium">
                      {day.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.filter(p => p.label !== "Break" && p.label !== "Lunch").map((period) => (
                  <tr key={period.id} className="border-b">
                    <td className="p-2 text-muted-foreground text-xs">{period.time}</td>
                    {days.map((day) => {
                      const classInfo = timetableData[day]?.[period.id]
                      return (
                        <td key={day} className="p-2">
                          {classInfo ? (
                            <div className="bg-primary/10 rounded p-1.5 text-xs">
                              <div className="font-medium truncate">{classInfo.class}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { Plus, Calendar, FileText, Award, ClipboardList } from "lucide-react"
import { format, isFuture, isPast } from "date-fns"

interface Exam {
  id: string
  name: string
  term: string
  class: { name: string }
  academic_year: string
  start_date: string
  end_date: string
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchExams()
  }, [])

  async function fetchExams() {
    setIsLoading(true)
    const { data } = await supabase
      .from("exams")
      .select(`
        *,
        class:classes(name)
      `)
      .order("start_date", { ascending: false })

    if (data) setExams(data)
    setIsLoading(false)
  }

  const upcomingExams = exams.filter((e) => isFuture(new Date(e.start_date)))
  const ongoingExams = exams.filter(
    (e) => !isFuture(new Date(e.start_date)) && isFuture(new Date(e.end_date))
  )
  const completedExams = exams.filter((e) => isPast(new Date(e.end_date)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Examinations</h1>
          <p className="text-muted-foreground">Manage exams, schedules, and results</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule New Examination</DialogTitle>
              <DialogDescription>Create a new exam schedule</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Examination Name</Label>
                <Input placeholder="e.g., Term 1 Examination" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Term</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="term1">Term 1</SelectItem>
                      <SelectItem value="midterm">Mid-Term</SelectItem>
                      <SelectItem value="term2">Term 2</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Class</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="10">Class 10</SelectItem>
                      <SelectItem value="12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Input type="date" />
                </div>
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Input type="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddOpen(false)}>Schedule Exam</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{upcomingExams.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled exams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <ClipboardList className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{ongoingExams.length}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedExams.length}</div>
            <p className="text-xs text-muted-foreground">Results available</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Exams</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="results">Results Entry</TabsTrigger>
          <TabsTrigger value="schedule">Date Sheet</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Examination List</CardTitle>
              <CardDescription>All scheduled examinations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Examination</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading exams...
                      </TableCell>
                    </TableRow>
                  ) : exams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No examinations scheduled yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    exams.map((exam) => {
                      const isUpcoming = isFuture(new Date(exam.start_date))
                      const isOngoing = !isFuture(new Date(exam.start_date)) && isFuture(new Date(exam.end_date))
                      const isCompleted = isPast(new Date(exam.end_date))

                      return (
                        <TableRow key={exam.id}>
                          <TableCell className="font-medium">{exam.name}</TableCell>
                          <TableCell className="capitalize">{exam.term.replace("_", " ")}</TableCell>
                          <TableCell>{exam.class?.name || "All Classes"}</TableCell>
                          <TableCell>{format(new Date(exam.start_date), "dd MMM yyyy")}</TableCell>
                          <TableCell>{format(new Date(exam.end_date), "dd MMM yyyy")}</TableCell>
                          <TableCell>
                            <Badge
                              variant={isOngoing ? "default" : isUpcoming ? "outline" : "secondary"}
                              className={isOngoing ? "bg-accent" : ""}
                            >
                              {isOngoing ? "Ongoing" : isUpcoming ? "Upcoming" : "Completed"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                              {isCompleted && (
                                <Button size="sm">Results</Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Examinations</CardTitle>
              <CardDescription>Exams scheduled in the future</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingExams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming examinations.
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingExams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{exam.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exam.class?.name} | {format(new Date(exam.start_date), "dd MMM")} - {format(new Date(exam.end_date), "dd MMM yyyy")}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View Schedule</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Results Entry</CardTitle>
              <CardDescription>Enter and manage examination results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="grid gap-2">
                  <Label>Select Examination</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {completedExams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Select Class</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10-a">Class 10-A</SelectItem>
                      <SelectItem value="10-b">Class 10-B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Select Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="eng">English</SelectItem>
                      <SelectItem value="sci">Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                Select examination, class, and subject to enter results
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Examination Date Sheet</CardTitle>
                  <CardDescription>Subject-wise exam schedule</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Print Date Sheet
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Select an examination to view its date sheet.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

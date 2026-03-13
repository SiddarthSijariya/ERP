"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts"
import { Download, FileText, Users, GraduationCap, IndianRupee, TrendingUp } from "lucide-react"

const attendanceData = [
  { month: "Apr", present: 92, absent: 8 },
  { month: "May", present: 88, absent: 12 },
  { month: "Jun", present: 90, absent: 10 },
  { month: "Jul", present: 85, absent: 15 },
  { month: "Aug", present: 91, absent: 9 },
  { month: "Sep", present: 89, absent: 11 },
  { month: "Oct", present: 93, absent: 7 },
  { month: "Nov", present: 87, absent: 13 },
  { month: "Dec", present: 90, absent: 10 },
  { month: "Jan", present: 94, absent: 6 },
]

const feeCollectionData = [
  { month: "Apr", collected: 450000, pending: 50000 },
  { month: "May", collected: 480000, pending: 45000 },
  { month: "Jun", collected: 420000, pending: 80000 },
  { month: "Jul", collected: 510000, pending: 40000 },
  { month: "Aug", collected: 490000, pending: 55000 },
  { month: "Sep", collected: 530000, pending: 35000 },
  { month: "Oct", collected: 500000, pending: 48000 },
  { month: "Nov", collected: 475000, pending: 60000 },
  { month: "Dec", collected: 520000, pending: 42000 },
  { month: "Jan", collected: 550000, pending: 30000 },
]

const classDistribution = [
  { name: "Nursery", value: 120 },
  { name: "KG", value: 150 },
  { name: "Primary (1-5)", value: 480 },
  { name: "Middle (6-8)", value: 320 },
  { name: "Secondary (9-10)", value: 180 },
  { name: "Senior (11-12)", value: 110 },
]

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--primary))"]

const performanceData = [
  { subject: "English", term1: 78, term2: 82, final: 80 },
  { subject: "Hindi", term1: 75, term2: 79, final: 77 },
  { subject: "Maths", term1: 72, term2: 76, final: 74 },
  { subject: "Science", term1: 80, term2: 84, final: 82 },
  { subject: "SST", term1: 76, term2: 80, final: 78 },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive reports and insights</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="2025-26">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-26">2025-26</SelectItem>
              <SelectItem value="2024-25">2024-25</SelectItem>
              <SelectItem value="2023-24">2023-24</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,360</div>
            <p className="text-xs text-muted-foreground">+48 from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.9%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">79.2L</div>
            <p className="text-xs text-muted-foreground">93% of target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.8%</div>
            <p className="text-xs text-muted-foreground">Board Exams 2025</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>Monthly attendance percentage</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar dataKey="present" name="Present %" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Student Distribution</CardTitle>
                <CardDescription>Students by class level</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {classDistribution.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fee Collection</CardTitle>
                <CardDescription>Monthly collection vs pending</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={feeCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `${value / 1000}K`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value)}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="collected" name="Collected" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                  <Line type="monotone" dataKey="pending" name="Pending" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ fill: "hsl(var(--destructive))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Academic Performance</CardTitle>
                <CardDescription>Average marks by subject (Class 10)</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" domain={[0, 100]} className="text-xs" />
                  <YAxis dataKey="subject" type="category" className="text-xs" width={60} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="term1" name="Term 1" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="term2" name="Term 2" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="final" name="Final" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Download detailed reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <FileText className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Student Report Cards</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Generate individual or bulk report cards
                </p>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="10">Class 10</SelectItem>
                      <SelectItem value="12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm">Generate</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Attendance Report</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Monthly or yearly attendance summary
                </p>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm">Generate</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <IndianRupee className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Fee Collection Report</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Detailed fee collection statements
                </p>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jan">January</SelectItem>
                      <SelectItem value="feb">February</SelectItem>
                      <SelectItem value="all">Full Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm">Generate</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

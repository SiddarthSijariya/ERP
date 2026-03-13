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
import { Plus, Search, Download, CreditCard, IndianRupee, TrendingUp, AlertCircle } from "lucide-react"
import { format } from "date-fns"

interface FeePayment {
  id: string
  student: {
    first_name: string
    last_name: string
    admission_number: string
    class: { name: string }
    section: { name: string }
  }
  fee_structure: {
    fee_type: { name: string }
    amount: number
  }
  amount_paid: number
  payment_date: string
  payment_method: string
  status: string
  receipt_number: string
}

interface FeeStructure {
  id: string
  fee_type: { name: string }
  class: { name: string }
  amount: number
  due_date: string
  academic_year: string
}

export default function FeesPage() {
  const [payments, setPayments] = useState<FeePayment[]>([])
  const [structures, setStructures] = useState<FeeStructure[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const stats = {
    totalCollected: 4850000,
    pendingAmount: 1250000,
    thisMonth: 850000,
    defaulters: 45
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setIsLoading(true)
    
    const { data: paymentsData } = await supabase
      .from("fee_payments")
      .select(`
        *,
        student:students(first_name, last_name, admission_number, class:classes(name), section:sections(name)),
        fee_structure:fee_structures(fee_type:fee_types(name), amount)
      `)
      .order("payment_date", { ascending: false })
      .limit(50)

    const { data: structuresData } = await supabase
      .from("fee_structures")
      .select(`
        *,
        fee_type:fee_types(name),
        class:classes(name)
      `)
      .order("due_date", { ascending: true })

    if (paymentsData) setPayments(paymentsData)
    if (structuresData) setStructures(structuresData)
    setIsLoading(false)
  }

  const filteredPayments = payments.filter(
    (p) =>
      p.student?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.student?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.student?.admission_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.receipt_number?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
          <p className="text-muted-foreground">Manage fee structures and track payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Record Fee Payment</DialogTitle>
                <DialogDescription>Enter the payment details below</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Student Admission No.</Label>
                  <Input placeholder="Enter admission number" />
                </div>
                <div className="grid gap-2">
                  <Label>Fee Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tuition">Tuition Fee</SelectItem>
                      <SelectItem value="transport">Transport Fee</SelectItem>
                      <SelectItem value="exam">Examination Fee</SelectItem>
                      <SelectItem value="library">Library Fee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Amount</Label>
                  <Input type="number" placeholder="Enter amount" />
                </div>
                <div className="grid gap-2">
                  <Label>Payment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="online">Online Transfer</SelectItem>
                      <SelectItem value="card">Card Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddPaymentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddPaymentOpen(false)}>Record Payment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(stats.totalCollected)}
            </div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(stats.pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting collection</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(stats.thisMonth)}
            </div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Defaulters</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.defaulters}</div>
            <p className="text-xs text-muted-foreground">Students with dues</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Recent Payments</TabsTrigger>
          <TabsTrigger value="structures">Fee Structures</TabsTrigger>
          <TabsTrigger value="defaulters">Defaulters</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Recent fee payments received</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or receipt..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt No.</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Loading payments...
                      </TableCell>
                    </TableRow>
                  ) : filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No payments found. Record a payment to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.receipt_number}</TableCell>
                        <TableCell>
                          {payment.student?.first_name} {payment.student?.last_name}
                          <br />
                          <span className="text-xs text-muted-foreground">{payment.student?.admission_number}</span>
                        </TableCell>
                        <TableCell>
                          {payment.student?.class?.name} - {payment.student?.section?.name}
                        </TableCell>
                        <TableCell>{payment.fee_structure?.fee_type?.name}</TableCell>
                        <TableCell className="font-medium">
                          {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(payment.amount_paid)}
                        </TableCell>
                        <TableCell className="capitalize">{payment.payment_method}</TableCell>
                        <TableCell>{format(new Date(payment.payment_date), "dd MMM yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structures" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Fee Structures</CardTitle>
                  <CardDescription>Configured fee types and amounts by class</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Structure
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fee Type</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Academic Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {structures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No fee structures configured yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    structures.map((structure) => (
                      <TableRow key={structure.id}>
                        <TableCell className="font-medium">{structure.fee_type?.name}</TableCell>
                        <TableCell>{structure.class?.name}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(structure.amount)}
                        </TableCell>
                        <TableCell>{format(new Date(structure.due_date), "dd MMM yyyy")}</TableCell>
                        <TableCell>{structure.academic_year}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defaulters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Defaulters</CardTitle>
              <CardDescription>Students with pending fee payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No fee defaulters at this time.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

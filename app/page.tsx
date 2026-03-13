import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  Bell, 
  CreditCard,
  ClipboardCheck,
  BarChart3,
  ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Student Management',
    description: 'Complete student information system with attendance tracking and performance monitoring.'
  },
  {
    icon: BookOpen,
    title: 'Academics',
    description: 'Manage classes, subjects, homework assignments, and examination schedules.'
  },
  {
    icon: CreditCard,
    title: 'Fee Management',
    description: 'Streamlined fee collection, payment tracking, and financial reporting.'
  },
  {
    icon: ClipboardCheck,
    title: 'Attendance',
    description: 'Daily attendance marking with real-time notifications to parents.'
  },
  {
    icon: Calendar,
    title: 'Timetable',
    description: 'Comprehensive class scheduling and teacher allocation system.'
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    description: 'Detailed performance reports, analytics, and insights for informed decisions.'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">G.L. International School</h1>
              <p className="text-xs text-muted-foreground">School ERP System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-6">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
            Complete School Management Solution
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl text-pretty">
            Streamline your school operations with our comprehensive ERP system. 
            Manage students, teachers, fees, attendance, and more - all in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Start Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign In to Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Comprehensive Features</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your school efficiently
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold">1000+</p>
              <p className="text-primary-foreground/80 mt-1">Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold">50+</p>
              <p className="text-primary-foreground/80 mt-1">Teachers</p>
            </div>
            <div>
              <p className="text-4xl font-bold">25+</p>
              <p className="text-primary-foreground/80 mt-1">Classes</p>
            </div>
            <div>
              <p className="text-4xl font-bold">98%</p>
              <p className="text-primary-foreground/80 mt-1">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-secondary border-border">
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-8 gap-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Ready to get started?</h3>
              <p className="text-muted-foreground mt-2">
                Join G.L. International School&apos;s digital transformation journey.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">G.L. International School</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2025-26 Academic Session. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, UserRole } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Bell, 
  Search, 
  Menu, 
  LogOut, 
  User, 
  Settings,
  GraduationCap
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  ClipboardCheck,
  Calendar,
  CreditCard,
  FileText,
  ImageIcon,
  BookOpenCheck,
  Clock,
  BarChart3
} from 'lucide-react'

interface HeaderProps {
  profile: Profile
}

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'parent', 'student'] },
  { title: 'Students', href: '/dashboard/students', icon: Users, roles: ['admin', 'teacher'] },
  { title: 'Teachers', href: '/dashboard/teachers', icon: UserCheck, roles: ['admin'] },
  { title: 'Classes', href: '/dashboard/classes', icon: BookOpen, roles: ['admin', 'teacher'] },
  { title: 'Attendance', href: '/dashboard/attendance', icon: ClipboardCheck, roles: ['admin', 'teacher', 'parent', 'student'] },
  { title: 'Homework', href: '/dashboard/homework', icon: BookOpenCheck, roles: ['admin', 'teacher', 'parent', 'student'] },
  { title: 'Timetable', href: '/dashboard/timetable', icon: Clock, roles: ['admin', 'teacher', 'parent', 'student'] },
  { title: 'Exams', href: '/dashboard/exams', icon: FileText, roles: ['admin', 'teacher', 'parent', 'student'] },
  { title: 'Fees', href: '/dashboard/fees', icon: CreditCard, roles: ['admin', 'parent'] },
  { title: 'Reports', href: '/dashboard/reports', icon: BarChart3, roles: ['admin', 'teacher', 'parent', 'student'] },
  { title: 'Calendar', href: '/dashboard/calendar', icon: Calendar, roles: ['admin', 'teacher', 'parent', 'student'] },
  { title: 'Notices', href: '/dashboard/notices', icon: Bell, roles: ['admin', 'teacher', 'parent', 'student'] },
  { title: 'Gallery', href: '/dashboard/gallery', icon: ImageIcon, roles: ['admin', 'teacher', 'parent', 'student'] },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['admin'] }
]

export function DashboardHeader({ profile }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const userRole = profile.role as UserRole

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole))

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar text-sidebar-foreground">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sidebar-primary">
              <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground text-sm">G.L. International</h1>
              <p className="text-xs text-sidebar-foreground/70">School ERP</p>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {filteredNavItems.map((item) => {
                const href = item.href.replace('/dashboard', `/dashboard/${userRole}`)
                const isActive = pathname === href || 
                  (item.href !== '/dashboard' && pathname.startsWith(href))
                
                return (
                  <li key={item.href}>
                    <Link
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-9 bg-secondary/50 border-border"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{profile.full_name || 'User'}</p>
                <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/${userRole}/profile`}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/${userRole}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

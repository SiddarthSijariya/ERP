'use client'

import React from "react"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Profile, UserRole } from '@/lib/types'
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  ClipboardCheck,
  Calendar,
  CreditCard,
  FileText,
  Bell,
  ImageIcon,
  Settings,
  BookOpenCheck,
  Clock,
  BarChart3
} from 'lucide-react'

interface SidebarProps {
  profile: Profile
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'teacher', 'parent', 'student']
  },
  {
    title: 'Students',
    href: '/dashboard/students',
    icon: Users,
    roles: ['admin', 'teacher']
  },
  {
    title: 'Teachers',
    href: '/dashboard/teachers',
    icon: UserCheck,
    roles: ['admin']
  },
  {
    title: 'Classes',
    href: '/dashboard/classes',
    icon: BookOpen,
    roles: ['admin', 'teacher']
  },
  {
    title: 'Attendance',
    href: '/dashboard/attendance',
    icon: ClipboardCheck,
    roles: ['admin', 'teacher', 'parent', 'student']
  },
  {
    title: 'Homework',
    href: '/dashboard/homework',
    icon: BookOpenCheck,
    roles: ['admin', 'teacher', 'parent', 'student']
  },
  {
    title: 'Timetable',
    href: '/dashboard/timetable',
    icon: Clock,
    roles: ['admin', 'teacher', 'parent', 'student']
  },
  {
    title: 'Exams',
    href: '/dashboard/exams',
    icon: FileText,
    roles: ['admin', 'teacher', 'parent', 'student']
  },
  {
    title: 'Fees',
    href: '/dashboard/fees',
    icon: CreditCard,
    roles: ['admin', 'parent']
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
    roles: ['admin', 'teacher', 'parent', 'student']
  },
  {
    title: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
    roles: ['admin', 'teacher', 'parent', 'student']
  },
  {
    title: 'Notices',
    href: '/dashboard/notices',
    icon: Bell,
    roles: ['admin', 'teacher', 'parent', 'student']
  },
  {
    title: 'Gallery',
    href: '/dashboard/gallery',
    icon: ImageIcon,
    roles: ['admin', 'teacher', 'parent', 'student']
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: ['admin']
  }
]

export function DashboardSidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const userRole = profile.role as UserRole

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole))

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sidebar-primary">
          <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-sidebar-foreground text-sm">G.L. International</h1>
          <p className="text-xs text-sidebar-foreground/70">School ERP</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href.replace('/dashboard', `/dashboard/${userRole}`)}
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

      {/* User Info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-accent-foreground">
              {profile.full_name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {profile.full_name || 'User'}
            </p>
            <p className="text-xs text-sidebar-foreground/70 capitalize">{profile.role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

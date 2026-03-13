import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, UserPlus, CreditCard, FileCheck, BookOpen } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'enrollment',
    title: 'New student enrolled',
    description: 'Rahul Kumar enrolled in Class 5-A',
    time: '2 hours ago',
    icon: UserPlus
  },
  {
    id: 2,
    type: 'payment',
    title: 'Fee payment received',
    description: 'Q1 tuition fee from Priya Sharma',
    time: '3 hours ago',
    icon: CreditCard
  },
  {
    id: 3,
    type: 'homework',
    title: 'Homework assigned',
    description: 'Mathematics homework for Class 6',
    time: '4 hours ago',
    icon: BookOpen
  },
  {
    id: 4,
    type: 'exam',
    title: 'Exam results published',
    description: 'Term 1 results for Class 5',
    time: '5 hours ago',
    icon: FileCheck
  },
  {
    id: 5,
    type: 'enrollment',
    title: 'Teacher profile updated',
    description: 'Ms. Anjali updated her profile',
    time: '6 hours ago',
    icon: UserPlus
  }
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest activities in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <activity.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export type UserRole = 'admin' | 'teacher' | 'parent' | 'student'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  avatar_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  name: string
  section: string
  academic_year: string
  class_teacher_id?: string
  created_at: string
}

export interface Student {
  id: string
  user_id: string
  class_id: string
  admission_number: string
  roll_number?: string
  date_of_birth?: string
  gender?: string
  blood_group?: string
  address?: string
  parent_id?: string
  emergency_contact?: string
  medical_conditions?: string
  created_at: string
}

export interface Teacher {
  id: string
  user_id: string
  employee_id: string
  department?: string
  qualification?: string
  date_of_joining?: string
  specialization?: string
  created_at: string
}

export interface Subject {
  id: string
  name: string
  code: string
  class_id: string
  teacher_id?: string
  created_at: string
}

export interface Attendance {
  id: string
  student_id: string
  class_id: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  remarks?: string
  marked_by: string
  created_at: string
}

export interface Homework {
  id: string
  title: string
  description?: string
  subject_id: string
  class_id: string
  teacher_id: string
  due_date: string
  attachment_url?: string
  created_at: string
}

export interface HomeworkSubmission {
  id: string
  homework_id: string
  student_id: string
  submission_url?: string
  submitted_at: string
  grade?: string
  feedback?: string
  graded_by?: string
  graded_at?: string
}

export interface FeeStructure {
  id: string
  name: string
  class_id: string
  amount: number
  fee_type: string
  academic_year: string
  due_date: string
  created_at: string
}

export interface FeePayment {
  id: string
  student_id: string
  fee_structure_id: string
  amount_paid: number
  payment_date: string
  payment_method: string
  transaction_id?: string
  receipt_number: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  created_at: string
}

export interface Exam {
  id: string
  name: string
  term: string
  class_id: string
  academic_year: string
  start_date: string
  end_date: string
  created_at: string
}

export interface ExamResult {
  id: string
  exam_id: string
  student_id: string
  subject_id: string
  marks_obtained: number
  max_marks: number
  grade?: string
  remarks?: string
  created_at: string
}

export interface Notice {
  id: string
  title: string
  content: string
  target_role?: string
  is_published: boolean
  published_at?: string
  created_by: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  description?: string
  event_date: string
  start_time?: string
  end_time?: string
  location?: string
  created_by?: string
  created_at: string
}

export interface Timetable {
  id: string
  class_id: string
  subject_id: string
  teacher_id: string
  day_of_week: number
  start_time: string
  end_time: string
  room?: string
  created_at: string
}

export interface GalleryAlbum {
  id: string
  title: string
  description?: string
  cover_image_url?: string
  is_published: boolean
  created_by?: string
  created_at: string
}

export interface GalleryPhoto {
  id: string
  album_id: string
  image_url: string
  caption?: string
  uploaded_by?: string
  created_at: string
}

export interface ModuleSettings {
  id: string
  module_name: string
  is_enabled: boolean
  settings: Record<string, unknown>
  updated_at: string
}

export interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  attendanceRate: number
  pendingFees: number
  upcomingEvents: number
}

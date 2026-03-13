-- School ERP Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text not null default 'student' check (role in ('super_admin', 'school_admin', 'teacher', 'parent', 'student')),
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Classes table
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  section text,
  academic_year text not null default '2025-26',
  created_at timestamp with time zone default now()
);

-- Subjects table
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text,
  class_id uuid references public.classes(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Students table
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  admission_number text unique not null,
  full_name text not null,
  dob date,
  gender text check (gender in ('male', 'female', 'other')),
  blood_group text,
  height text,
  weight text,
  address text,
  photo_url text,
  class_id uuid references public.classes(id) on delete set null,
  parent_id uuid references public.profiles(id) on delete set null,
  transport_route text,
  pickup_point text,
  pickup_time text,
  driver_name text,
  driver_phone text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Teachers table
create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  employee_id text unique not null,
  full_name text not null,
  phone text,
  email text,
  qualification text,
  specialization text,
  joining_date date,
  photo_url text,
  created_at timestamp with time zone default now()
);

-- Class-Teacher assignments
create table if not exists public.class_teachers (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  is_class_teacher boolean default false,
  created_at timestamp with time zone default now(),
  unique(class_id, teacher_id, subject_id)
);

-- Attendance table
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  class_id uuid references public.classes(id) on delete cascade,
  date date not null,
  status text not null check (status in ('present', 'absent', 'late', 'excused')),
  marked_by uuid references public.profiles(id),
  created_at timestamp with time zone default now(),
  unique(student_id, date)
);

-- Homework table
create table if not exists public.homework (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  class_id uuid references public.classes(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  assigned_by uuid references public.teachers(id) on delete set null,
  due_date date not null,
  attachment_url text,
  created_at timestamp with time zone default now()
);

-- Homework submissions
create table if not exists public.homework_submissions (
  id uuid primary key default gen_random_uuid(),
  homework_id uuid references public.homework(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  submission_url text,
  submitted_at timestamp with time zone default now(),
  grade text,
  feedback text,
  unique(homework_id, student_id)
);

-- Online classes table
create table if not exists public.online_classes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  class_id uuid references public.classes(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete set null,
  scheduled_at timestamp with time zone not null,
  duration_minutes integer default 60,
  meeting_link text,
  recording_url text,
  status text default 'scheduled' check (status in ('scheduled', 'live', 'completed', 'cancelled')),
  created_at timestamp with time zone default now()
);

-- Class attendance for online classes
create table if not exists public.online_class_attendance (
  id uuid primary key default gen_random_uuid(),
  online_class_id uuid references public.online_classes(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  joined_at timestamp with time zone default now(),
  unique(online_class_id, student_id)
);

-- Fee structure table
create table if not exists public.fee_structures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  class_id uuid references public.classes(id) on delete cascade,
  amount decimal(10,2) not null,
  fee_type text not null check (fee_type in ('tuition', 'transport', 'books', 'exam', 'other')),
  academic_year text not null default '2025-26',
  due_date date,
  created_at timestamp with time zone default now()
);

-- Fee payments table
create table if not exists public.fee_payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  fee_structure_id uuid references public.fee_structures(id) on delete cascade,
  amount_paid decimal(10,2) not null,
  payment_date timestamp with time zone default now(),
  payment_method text check (payment_method in ('upi', 'card', 'cash', 'bank_transfer')),
  transaction_id text,
  receipt_number text unique,
  status text default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamp with time zone default now()
);

-- Exams table
create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  term text not null check (term in ('term1', 'term2', 'midterm', 'final')),
  class_id uuid references public.classes(id) on delete cascade,
  academic_year text not null default '2025-26',
  start_date date,
  end_date date,
  created_at timestamp with time zone default now()
);

-- Exam results table
create table if not exists public.exam_results (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references public.exams(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  marks_obtained decimal(5,2),
  max_marks decimal(5,2) default 100,
  grade text,
  remarks text,
  created_at timestamp with time zone default now(),
  unique(exam_id, student_id, subject_id)
);

-- Notices/Announcements table
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  target_role text check (target_role in ('all', 'teachers', 'parents', 'students')),
  target_class_id uuid references public.classes(id) on delete cascade,
  published_by uuid references public.profiles(id),
  is_published boolean default true,
  publish_date timestamp with time zone default now(),
  expiry_date timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  start_time time,
  end_time time,
  location text,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now()
);

-- Gallery/Albums table
create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_image_url text,
  event_id uuid references public.events(id) on delete set null,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now()
);

-- Gallery photos table
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references public.gallery_albums(id) on delete cascade,
  image_url text not null,
  caption text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamp with time zone default now()
);

-- Timetable table
create table if not exists public.timetable (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete set null,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamp with time zone default now()
);

-- Module settings for admin customization
create table if not exists public.module_settings (
  id uuid primary key default gen_random_uuid(),
  module_name text not null unique,
  is_enabled boolean default true,
  settings jsonb default '{}',
  updated_at timestamp with time zone default now()
);

-- Grading scale
create table if not exists public.grading_scale (
  id uuid primary key default gen_random_uuid(),
  min_percentage decimal(5,2) not null,
  max_percentage decimal(5,2) not null,
  grade text not null,
  grade_point decimal(3,2),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.subjects enable row level security;
alter table public.students enable row level security;
alter table public.teachers enable row level security;
alter table public.class_teachers enable row level security;
alter table public.attendance enable row level security;
alter table public.homework enable row level security;
alter table public.homework_submissions enable row level security;
alter table public.online_classes enable row level security;
alter table public.online_class_attendance enable row level security;
alter table public.fee_structures enable row level security;
alter table public.fee_payments enable row level security;
alter table public.exams enable row level security;
alter table public.exam_results enable row level security;
alter table public.notices enable row level security;
alter table public.events enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.timetable enable row level security;
alter table public.module_settings enable row level security;
alter table public.grading_scale enable row level security;

-- RLS Policies for profiles
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_admin_all" on public.profiles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);

-- RLS Policies for classes (viewable by all authenticated, editable by admins)
create policy "classes_select_all" on public.classes for select using (true);
create policy "classes_admin_insert" on public.classes for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);
create policy "classes_admin_update" on public.classes for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);
create policy "classes_admin_delete" on public.classes for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);

-- RLS Policies for subjects
create policy "subjects_select_all" on public.subjects for select using (true);
create policy "subjects_admin_insert" on public.subjects for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);
create policy "subjects_admin_update" on public.subjects for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);
create policy "subjects_admin_delete" on public.subjects for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);

-- RLS Policies for students
create policy "students_select_all" on public.students for select using (true);
create policy "students_admin_insert" on public.students for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);
create policy "students_admin_update" on public.students for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);
create policy "students_admin_delete" on public.students for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);

-- RLS Policies for teachers
create policy "teachers_select_all" on public.teachers for select using (true);
create policy "teachers_admin_insert" on public.teachers for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);
create policy "teachers_admin_update" on public.teachers for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);
create policy "teachers_admin_delete" on public.teachers for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);

-- RLS Policies for attendance
create policy "attendance_select_all" on public.attendance for select using (true);
create policy "attendance_teacher_insert" on public.attendance for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin', 'teacher'))
);
create policy "attendance_teacher_update" on public.attendance for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin', 'teacher'))
);

-- RLS Policies for homework
create policy "homework_select_all" on public.homework for select using (true);
create policy "homework_teacher_insert" on public.homework for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin', 'teacher'))
);
create policy "homework_teacher_update" on public.homework for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin', 'teacher'))
);
create policy "homework_teacher_delete" on public.homework for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin', 'teacher'))
);

-- RLS Policies for homework submissions
create policy "homework_submissions_select_all" on public.homework_submissions for select using (true);
create policy "homework_submissions_student_insert" on public.homework_submissions for insert with check (true);
create policy "homework_submissions_update" on public.homework_submissions for update using (true);

-- RLS Policies for online classes
create policy "online_classes_select_all" on public.online_classes for select using (true);
create policy "online_classes_teacher_insert" on public.online_classes for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin', 'teacher'))
);
create policy "online_classes_teacher_update" on public.online_classes for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin', 'teacher'))
);

-- RLS Policies for fee structures
create policy "fee_structures_select_all" on public.fee_structures for select using (true);
create policy "fee_structures_admin_insert" on public.fee_structures for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);
create policy "fee_structures_admin_update" on public.fee_structures for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);

-- RLS Policies for fee payments
create policy "fee_payments_select_all" on public.fee_payments for select using (true);
create policy "fee_payments_insert" on public.fee_payments for insert with check (true);
create policy "fee_payments_admin_update" on public.fee_payments for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);

-- RLS Policies for exams and results
create policy "exams_select_all" on public.exams for select using (true);
create policy "exams_admin_insert" on public.exams for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);
create policy "exam_results_select_all" on public.exam_results for select using (true);
create policy "exam_results_teacher_insert" on public.exam_results for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin', 'teacher'))
);
create policy "exam_results_teacher_update" on public.exam_results for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin', 'teacher'))
);

-- RLS Policies for notices
create policy "notices_select_all" on public.notices for select using (true);
create policy "notices_admin_insert" on public.notices for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin', 'teacher'))
);
create policy "notices_admin_update" on public.notices for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin', 'teacher'))
);

-- RLS Policies for events
create policy "events_select_all" on public.events for select using (true);
create policy "events_admin_insert" on public.events for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);

-- RLS Policies for gallery
create policy "gallery_albums_select_all" on public.gallery_albums for select using (true);
create policy "gallery_albums_admin_insert" on public.gallery_albums for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);
create policy "gallery_photos_select_all" on public.gallery_photos for select using (true);
create policy "gallery_photos_admin_insert" on public.gallery_photos for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);

-- RLS Policies for timetable
create policy "timetable_select_all" on public.timetable for select using (true);
create policy "timetable_admin_insert" on public.timetable for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);
create policy "timetable_admin_update" on public.timetable for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);

-- RLS Policies for module settings
create policy "module_settings_select_all" on public.module_settings for select using (true);
create policy "module_settings_admin_all" on public.module_settings for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);

-- RLS Policies for grading scale
create policy "grading_scale_select_all" on public.grading_scale for select using (true);
create policy "grading_scale_admin_all" on public.grading_scale for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);

-- RLS for class_teachers
create policy "class_teachers_select_all" on public.class_teachers for select using (true);
create policy "class_teachers_admin_all" on public.class_teachers for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin', 'school_admin'))
);

-- RLS for online_class_attendance
create policy "online_class_attendance_select_all" on public.online_class_attendance for select using (true);
create policy "online_class_attendance_insert" on public.online_class_attendance for insert with check (true);

-- Trigger for auto-creating profiles on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Seed data for School ERP

-- Insert default grading scale
insert into public.grading_scale (min_percentage, max_percentage, grade, grade_point) values
  (90, 100, 'A+', 4.0),
  (80, 89.99, 'A', 3.7),
  (70, 79.99, 'B+', 3.3),
  (60, 69.99, 'B', 3.0),
  (50, 59.99, 'C+', 2.7),
  (40, 49.99, 'C', 2.3),
  (33, 39.99, 'D', 2.0),
  (0, 32.99, 'F', 0.0)
on conflict do nothing;

-- Insert default module settings
insert into public.module_settings (module_name, is_enabled, settings) values
  ('attendance', true, '{"allow_late_marking": true, "auto_notify_absence": true}'),
  ('homework', true, '{"allow_late_submission": true, "max_file_size_mb": 10}'),
  ('online_classes', true, '{"default_duration": 60, "auto_record": false}'),
  ('fees', true, '{"late_fee_percentage": 5, "reminder_days_before": 7}'),
  ('reports', true, '{"show_class_average": true, "show_rank": false}'),
  ('gallery', true, '{"max_photos_per_album": 100}'),
  ('notifications', true, '{"email_enabled": true, "sms_enabled": false}'),
  ('transport', true, '{"track_live_location": false}')
on conflict do nothing;

-- Insert sample classes
insert into public.classes (id, name, section, academic_year) values
  ('c1000000-0000-0000-0000-000000000001', 'Pre-KG', 'A', '2025-26'),
  ('c1000000-0000-0000-0000-000000000002', 'LKG', 'A', '2025-26'),
  ('c1000000-0000-0000-0000-000000000003', 'UKG', 'A', '2025-26'),
  ('c1000000-0000-0000-0000-000000000004', 'Class 1', 'A', '2025-26'),
  ('c1000000-0000-0000-0000-000000000005', 'Class 2', 'A', '2025-26'),
  ('c1000000-0000-0000-0000-000000000006', 'Class 3', 'A', '2025-26'),
  ('c1000000-0000-0000-0000-000000000007', 'Class 4', 'A', '2025-26'),
  ('c1000000-0000-0000-0000-000000000008', 'Class 5', 'A', '2025-26'),
  ('c1000000-0000-0000-0000-000000000009', 'Class 6', 'A', '2025-26'),
  ('c1000000-0000-0000-0000-000000000010', 'Class 7', 'A', '2025-26'),
  ('c1000000-0000-0000-0000-000000000011', 'Class 8', 'A', '2025-26')
on conflict do nothing;

-- Insert sample subjects for Class 5
insert into public.subjects (id, name, code, class_id) values
  ('a1000000-0000-0000-0000-000000000001', 'English', 'ENG', 'c1000000-0000-0000-0000-000000000008'),
  ('a1000000-0000-0000-0000-000000000002', 'Hindi', 'HIN', 'c1000000-0000-0000-0000-000000000008'),
  ('a1000000-0000-0000-0000-000000000003', 'Mathematics', 'MATH', 'c1000000-0000-0000-0000-000000000008'),
  ('a1000000-0000-0000-0000-000000000004', 'Science', 'SCI', 'c1000000-0000-0000-0000-000000000008'),
  ('a1000000-0000-0000-0000-000000000005', 'Social Studies', 'SST', 'c1000000-0000-0000-0000-000000000008'),
  ('a1000000-0000-0000-0000-000000000006', 'Computer Science', 'CS', 'c1000000-0000-0000-0000-000000000008'),
  ('a1000000-0000-0000-0000-000000000007', 'Art & Craft', 'ART', 'c1000000-0000-0000-0000-000000000008'),
  ('a1000000-0000-0000-0000-000000000008', 'Physical Education', 'PE', 'c1000000-0000-0000-0000-000000000008')
on conflict do nothing;

-- Insert sample fee structures
insert into public.fee_structures (name, class_id, amount, fee_type, academic_year, due_date) values
  ('Tuition Fee Q1', 'c1000000-0000-0000-0000-000000000008', 15000.00, 'tuition', '2025-26', '2025-04-15'),
  ('Tuition Fee Q2', 'c1000000-0000-0000-0000-000000000008', 15000.00, 'tuition', '2025-26', '2025-07-15'),
  ('Tuition Fee Q3', 'c1000000-0000-0000-0000-000000000008', 15000.00, 'tuition', '2025-26', '2025-10-15'),
  ('Tuition Fee Q4', 'c1000000-0000-0000-0000-000000000008', 15000.00, 'tuition', '2025-26', '2026-01-15'),
  ('Transport Fee (Annual)', 'c1000000-0000-0000-0000-000000000008', 24000.00, 'transport', '2025-26', '2025-04-30'),
  ('Books & Stationery', 'c1000000-0000-0000-0000-000000000008', 5000.00, 'books', '2025-26', '2025-04-15'),
  ('Exam Fee Term 1', 'c1000000-0000-0000-0000-000000000008', 2000.00, 'exam', '2025-26', '2025-09-01'),
  ('Exam Fee Term 2', 'c1000000-0000-0000-0000-000000000008', 2000.00, 'exam', '2025-26', '2026-02-01')
on conflict do nothing;

-- Insert sample exams
insert into public.exams (id, name, term, class_id, academic_year, start_date, end_date) values
  ('b1000000-0000-0000-0000-000000000001', 'Term 1 Examination', 'term1', 'c1000000-0000-0000-0000-000000000008', '2025-26', '2025-09-15', '2025-09-25'),
  ('b1000000-0000-0000-0000-000000000002', 'Mid-Term Examination', 'midterm', 'c1000000-0000-0000-0000-000000000008', '2025-26', '2025-12-01', '2025-12-10'),
  ('b1000000-0000-0000-0000-000000000003', 'Term 2 Examination', 'term2', 'c1000000-0000-0000-0000-000000000008', '2025-26', '2026-03-01', '2026-03-15')
on conflict do nothing;

-- Insert sample events
insert into public.events (title, description, event_date, start_time, end_time, location) values
  ('Annual Sports Day', 'Join us for the annual sports day celebrations with various athletic events and competitions.', '2025-11-15', '08:00', '16:00', 'School Ground'),
  ('Parent-Teacher Meeting', 'Quarterly meeting to discuss student progress and academic performance.', '2025-10-20', '10:00', '14:00', 'School Auditorium'),
  ('Science Exhibition', 'Students showcase their innovative science projects.', '2025-12-05', '09:00', '15:00', 'School Hall'),
  ('Republic Day Celebration', 'Flag hoisting ceremony and cultural programs.', '2026-01-26', '08:00', '12:00', 'School Ground'),
  ('Annual Day Function', 'Grand celebration with performances by students.', '2026-02-28', '17:00', '21:00', 'School Auditorium')
on conflict do nothing;

-- Insert sample notices
insert into public.notices (title, content, target_role, is_published) values
  ('Winter Vacation Notice', 'Dear Parents, please note that winter vacation will be from December 25th to January 5th. School will resume on January 6th, 2026.', 'all', true),
  ('Fee Payment Reminder', 'This is a reminder that Q2 tuition fees are due by July 15th. Please clear all pending dues to avoid late fees.', 'parents', true),
  ('Staff Meeting', 'All teachers are requested to attend the staff meeting on Monday at 3:30 PM in the conference room.', 'teachers', true),
  ('Homework Submission Deadline', 'All pending homework assignments must be submitted by Friday. Late submissions will not be accepted.', 'students', true),
  ('New Academic Calendar', 'The new academic calendar for 2025-26 has been uploaded. Please check the school website for details.', 'all', true)
on conflict do nothing;

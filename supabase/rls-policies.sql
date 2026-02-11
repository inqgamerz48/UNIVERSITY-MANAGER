-- ============================================
-- UNI Manager RLS (Row Level Security) Policies
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_pre_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Institution Policies
-- ============================================

-- Everyone can view active institutions
CREATE POLICY "Anyone can view active institutions" ON institutions
  FOR SELECT USING (is_active = true);

-- Only SUPER_ADMIN can modify institutions
CREATE POLICY "Super admins can manage institutions" ON institutions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    )
  );

-- ============================================
-- User Policies
-- ============================================

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users in their institution
CREATE POLICY "Admins can view institution users" ON users
  FOR SELECT USING (
    institution_id = (
      SELECT institution_id FROM users WHERE id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- ============================================
-- Profile Policies
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (user_id = auth.uid());

-- Admins can view all profiles in their institution
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role IN ('ADMIN', 'SUPER_ADMIN')
      AND EXISTS (
        SELECT 1 FROM users u2
        WHERE u2.institution_id = u.institution_id
        AND u2.id = profiles.user_id
      )
    ) OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    )
  );

-- ============================================
-- Student Pre-Import Policies
-- ============================================

-- Only admins can view pre-imports
CREATE POLICY "Admins can view pre-imports" ON student_pre_imports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- Only admins can modify pre-imports
CREATE POLICY "Admins can manage pre-imports" ON student_pre_imports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- ============================================
-- Assignment Policies
-- ============================================

-- Everyone can view active assignments
CREATE POLICY "Anyone can view active assignments" ON assignments
  FOR SELECT USING (is_active = true);

-- Faculty can manage their own assignments
CREATE POLICY "Faculty can manage assignments" ON assignments
  FOR ALL USING (faculty_id = auth.uid());

-- Admins can view all assignments
CREATE POLICY "Admins can view all assignments" ON assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- ============================================
-- Submission Policies
-- ============================================

-- Students can view their own submissions
CREATE POLICY "Students can view own submissions" ON submissions
  FOR SELECT USING (student_id = auth.uid());

-- Students can create their own submissions
CREATE POLICY "Students can create submissions" ON submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Students can update their own submissions (before grading)
CREATE POLICY "Students can update own submissions" ON submissions
  FOR UPDATE USING (
    student_id = auth.uid() AND graded_at IS NULL
  );

-- Faculty can view submissions for their assignments
CREATE POLICY "Faculty can view assignment submissions" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assignments
      WHERE id = submissions.assignment_id AND faculty_id = auth.uid()
    )
  );

-- Faculty can grade submissions
CREATE POLICY "Faculty can grade submissions" ON submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM assignments
      WHERE id = submissions.assignment_id AND faculty_id = auth.uid()
    )
  );

-- ============================================
-- Attendance Policies
-- ============================================

-- Students can view their own attendance
CREATE POLICY "Students can view own attendance" ON attendance
  FOR SELECT USING (student_id = auth.uid());

-- Faculty can manage attendance for their subjects
CREATE POLICY "Faculty can manage attendance" ON attendance
  FOR ALL USING (
    marked_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- ============================================
-- Notice Policies
-- ============================================

-- Everyone can view active notices
CREATE POLICY "Anyone can view active notices" ON notices
  FOR SELECT USING (is_active = true);

-- Admins can manage notices
CREATE POLICY "Admins can manage notices" ON notices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- ============================================
-- Complaint Policies
-- ============================================

-- Students can view their own complaints
CREATE POLICY "Students can view own complaints" ON complaints
  FOR SELECT USING (student_id = auth.uid());

-- Students can create complaints
CREATE POLICY "Students can create complaints" ON complaints
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Students can update their own complaints (if not resolved)
CREATE POLICY "Students can update own complaints" ON complaints
  FOR UPDATE USING (
    student_id = auth.uid() AND status IN ('PENDING', 'IN_PROGRESS')
  );

-- Admins can view all complaints
CREATE POLICY "Admins can view all complaints" ON complaints
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- Admins can update complaints
CREATE POLICY "Admins can update complaints" ON complaints
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

-- ============================================
-- Helper Views
-- ============================================

-- Create a view to check user's institution
CREATE OR REPLACE VIEW user_institutions AS
SELECT 
  u.id as user_id,
  u.institution_id,
  i.name as institution_name,
  i.code as institution_code,
  u.role
FROM users u
LEFT JOIN institutions i ON u.institution_id = i.id
WHERE u.id = auth.uid();

-- ============================================
-- Function to get current user's institution ID
-- ============================================

CREATE OR REPLACE FUNCTION current_institution_id()
RETURNS uuid AS $$
  SELECT institution_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

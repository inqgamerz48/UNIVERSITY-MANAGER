-- Add missing Admin policy for subjects table

-- Admins can manage subjects (insert, update, delete)
CREATE POLICY "Admins can manage subjects" ON subjects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN')
    )
  );

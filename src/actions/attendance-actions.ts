"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAttendance(studentId: string, subjectId: string, date: string, status: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("attendance").upsert({
    student_id: studentId,
    subject_id: subjectId,
    date,
    status,
    marked_by: user.id,
  }, {
    onConflict: "student_id, date, subject_id"
  });

  if (error) return { error: error.message };

  revalidatePath("/faculty/dashboard");
  return { success: true };
}

export async function getStudentAttendance(studentId: string, month?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("attendance")
    .select(`
      *,
      subject:subjects(name, code)
    `)
    .eq("student_id", studentId);

  if (month) {
    query = query.gte("date", `${month}-01`).lte("date", `${month}-31`);
  }

  const { data, error } = await query.order("date", { ascending: false });
  if (error) return { error: error.message };
  return { data };
}

export async function getClassAttendance(subjectId: string, date: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attendance")
    .select(`
      *,
      student:students(
        id,
        pin_number,
        user:users(
          profile:profiles(
            full_name
          )
        )
      )
    `)
    .eq("subject_id", subjectId)
    .eq("date", date);

  if (error) return { error: error.message };
  return { data };
}

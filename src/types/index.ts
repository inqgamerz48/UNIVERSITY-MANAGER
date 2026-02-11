import { Role, AttendanceStatus, ComplaintStatus } from "@prisma/client";

export type { Role, AttendanceStatus, ComplaintStatus };

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  fullName: string;
  avatarUrl?: string;
  department?: string;
  studentId?: string;
  facultyId?: string;
}

export interface AssignmentWithSubmission {
  id: string;
  title: string;
  description?: string | null;
  dueDate: Date;
  subjectCode: string;
  subjectName: string;
  maxGrade: number;
  submission?: {
    id: string;
    grade: number | null;
    feedback: string | null;
    submittedAt: Date;
  } | null;
}

export interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  totalAssignments: number;
  pendingSubmissions: number;
  attendanceRate: number;
  complaintsResolved: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  category: string;
  publishedAt: Date;
  expiresAt?: Date | null;
}

export interface ComplaintWithStatus {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date | null;
  resolution?: string | null;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: Date;
  status: AttendanceStatus;
  subjectCode: string;
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

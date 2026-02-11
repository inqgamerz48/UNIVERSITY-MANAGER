import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine((email) => email.endsWith("@gmail.com"), {
      message: "Only @gmail.com email addresses are allowed",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  pinNumber: z
    .string()
    .min(1, "PIN number is required")
    .regex(
      /^\d{2}\d{3}-[A-Za-z]{2}-\d{3}$/,
      "Invalid PIN format. Use: YY622-DEPT-PIN (e.g., 23622-CM-001)"
    ),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  instructions: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  subjectCode: z.string().min(1, "Subject code is required"),
  subjectName: z.string().min(1, "Subject name is required"),
  maxGrade: z.number().min(0).max(100).default(100),
});

export const submissionSchema = z.object({
  content: z.string().optional(),
  fileUrl: z.string().url().optional().or(z.literal("")),
});

export const attendanceSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  subjectCode: z.string().min(1, "Subject is required"),
});

export const noticeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  category: z.string().min(1, "Category is required").default("general"),
});

export const complaintSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required").default("general"),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  department: z.string().optional(),
  year: z.string().optional(),
  semester: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AssignmentInput = z.infer<typeof assignmentSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
export type NoticeInput = z.infer<typeof noticeSchema>;
export type ComplaintInput = z.infer<typeof complaintSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

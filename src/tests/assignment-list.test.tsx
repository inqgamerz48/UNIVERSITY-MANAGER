import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssignmentList } from "@/components/assignment-list";
import { useAuthStore } from "@/stores/auth-store";
import { createClient } from "@/lib/supabase/client";

// Mock the supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

// Mock the auth store
vi.mock("@/stores/auth-store", () => ({
  useAuthStore: vi.fn(),
}));

// Mock the dashboard hooks
vi.mock("@/hooks/use-dashboard", () => ({
  useSubjects: vi.fn(() => ({ subjects: [], loading: false })),
  createAssignment: vi.fn(),
}));

describe("AssignmentList Component", () => {
  const mockSupabase = {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: "faculty-1" } })),
          order: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      })),
    })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as any).mockReturnValue(mockSupabase);
    (useAuthStore as any).mockReturnValue({
      user: { id: "user-1", email: "faculty@test.com", role: "FACULTY" },
    });
  });

  it("renders loading state initially", () => {
    render(<AssignmentList />);
    expect(screen.getByText(/assignments/i)).toBeInTheDocument();
  });

  it("renders empty state when no assignments", async () => {
    render(<AssignmentList />);
    
    await waitFor(() => {
      expect(screen.getByText(/no assignments/i)).toBeInTheDocument();
    });
  });

  it("opens create dialog when button clicked", async () => {
    const user = userEvent.setup();
    render(<AssignmentList />);
    
    const createButton = screen.getByText(/create assignment/i);
    await user.click(createButton);
    
    expect(screen.getByText(/create new assignment/i)).toBeInTheDocument();
  });

  it("validates required fields in create form", async () => {
    const user = userEvent.setup();
    render(<AssignmentList />);
    
    // Open dialog
    const createButton = screen.getByText(/create assignment/i);
    await user.click(createButton);
    
    // Try to submit without filling fields
    const submitButton = screen.getByText(/create assignment$/i);
    await user.click(submitButton);
    
    // Form should still be open (validation failed)
    expect(screen.getByText(/create new assignment/i)).toBeInTheDocument();
  });

  it("displays assignments when data loaded", async () => {
    const mockAssignments = [
      {
        id: "1",
        title: "Test Assignment",
        description: "Test description",
        due_date: "2026-12-31",
        max_grade: 100,
        subject_code: "CS101",
        subject_name: "Computer Science",
        submissions_count: 5,
        is_active: true,
      },
    ];

    mockSupabase.from = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: "faculty-1" } })),
          order: vi.fn(() => Promise.resolve({ data: mockAssignments })),
        })),
      })),
    }));

    render(<AssignmentList />);
    
    await waitFor(() => {
      expect(screen.getByText("Test Assignment")).toBeInTheDocument();
    });
  });

  it("shows correct status badges", async () => {
    const mockAssignments = [
      {
        id: "1",
        title: "Overdue Assignment",
        description: "Test",
        due_date: "2020-01-01", // Past date
        max_grade: 100,
        subject_code: "CS101",
        subject_name: "CS",
        submissions_count: 0,
        is_active: true,
      },
    ];

    mockSupabase.from = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: "faculty-1" } })),
          order: vi.fn(() => Promise.resolve({ data: mockAssignments })),
        })),
      })),
    }));

    render(<AssignmentList />);
    
    await waitFor(() => {
      expect(screen.getByText(/expired/i)).toBeInTheDocument();
    });
  });
});

describe("AssignmentList Integration", () => {
  it("handles API errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.reject(new Error("API Error"))),
          })),
        })),
      })),
    });

    (useAuthStore as any).mockReturnValue({
      user: { id: "user-1", email: "faculty@test.com", role: "FACULTY" },
    });

    render(<AssignmentList />);
    
    await waitFor(() => {
      expect(screen.getByText(/no assignments/i)).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  it("fetches assignments for correct faculty", async () => {
    const mockFrom = vi.fn();
    (createClient as any).mockReturnValue({
      from: mockFrom,
    });

    mockFrom.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: "faculty-123" } })),
          order: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      })),
    });

    (useAuthStore as any).mockReturnValue({
      user: { id: "user-1", email: "faculty@test.com", role: "FACULTY" },
    });

    render(<AssignmentList />);
    
    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith("assignments");
    });
  });
});

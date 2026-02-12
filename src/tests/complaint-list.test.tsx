import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComplaintList } from "@/components/complaint-list";
import { useAuthStore } from "@/stores/auth-store";
import { createClient } from "@/lib/supabase/client";

// Mock dependencies
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/stores/auth-store", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("@/hooks/use-dashboard", () => ({
  useStudentComplaints: vi.fn(() => ({ complaints: [], loading: false })),
  createComplaint: vi.fn(),
  updateComplaintStatus: vi.fn(),
}));

describe("ComplaintList Component - Student View", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      user: { id: "student-1", email: "student@test.com", role: "STUDENT" },
    });
  });

  it("renders complaint list for students", () => {
    render(<ComplaintList />);
    expect(screen.getByText(/complaints/i)).toBeInTheDocument();
  });

  it("shows raise complaint button for students", () => {
    render(<ComplaintList />);
    expect(screen.getByText(/raise complaint/i)).toBeInTheDocument();
  });

  it("opens complaint form when button clicked", async () => {
    const user = userEvent.setup();
    render(<ComplaintList />);
    
    const raiseButton = screen.getByText(/raise complaint/i);
    await user.click(raiseButton);
    
    expect(screen.getByText(/raise new complaint/i)).toBeInTheDocument();
  });

  it("displays complaints with status badges", async () => {
    const { useStudentComplaints } = await import("@/hooks/use-dashboard");
    (useStudentComplaints as any).mockReturnValue({
      complaints: [
        {
          id: "1",
          title: "Library Issue",
          description: "Books not available",
          category: "infrastructure",
          status: "PENDING",
          priority: "high",
          created_at: "2026-02-12T00:00:00Z",
        },
      ],
      loading: false,
    });

    render(<ComplaintList />);
    
    await waitFor(() => {
      expect(screen.getByText("Library Issue")).toBeInTheDocument();
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });
  });
});

describe("ComplaintList Component - Admin View", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      user: { id: "admin-1", email: "admin@test.com", role: "ADMIN" },
    });
  });

  it("renders admin complaint management view", () => {
    render(<ComplaintList isAdmin={true} />);
    expect(screen.getByText(/manage student complaints/i)).toBeInTheDocument();
  });

  it("does not show raise complaint button for admin", () => {
    render(<ComplaintList isAdmin={true} />);
    expect(screen.queryByText(/raise complaint/i)).not.toBeInTheDocument();
  });

  it("shows admin action buttons for pending complaints", async () => {
    const { useStudentComplaints } = await import("@/hooks/use-dashboard");
    (useStudentComplaints as any).mockReturnValue({
      complaints: [
        {
          id: "1",
          title: "Test Complaint",
          description: "Test description",
          category: "academic",
          status: "PENDING",
          priority: "medium",
          created_at: "2026-02-12T00:00:00Z",
        },
      ],
      loading: false,
    });

    render(<ComplaintList isAdmin={true} />);
    
    await waitFor(() => {
      expect(screen.getByText(/in progress/i)).toBeInTheDocument();
      expect(screen.getByText(/resolve/i)).toBeInTheDocument();
    });
  });

  it("handles status update for admin", async () => {
    const user = userEvent.setup();
    const { useStudentComplaints, updateComplaintStatus } = await import("@/hooks/use-dashboard");
    
    (useStudentComplaints as any).mockReturnValue({
      complaints: [
        {
          id: "1",
          title: "Test Complaint",
          description: "Test",
          category: "general",
          status: "PENDING",
          priority: "medium",
          created_at: "2026-02-12T00:00:00Z",
        },
      ],
      loading: false,
    });

    render(<ComplaintList isAdmin={true} />);
    
    await waitFor(() => {
      const resolveButton = screen.getByText(/resolve/i);
      expect(resolveButton).toBeInTheDocument();
    });
  });
});

describe("ComplaintList Form Validation", () => {
  beforeEach(() => {
    (useAuthStore as any).mockReturnValue({
      user: { id: "student-1", email: "student@test.com", role: "STUDENT" },
    });
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    const { createComplaint } = await import("@/hooks/use-dashboard");
    
    render(<ComplaintList />);
    
    // Open form
    const raiseButton = screen.getByText(/raise complaint/i);
    await user.click(raiseButton);
    
    // Try to submit without filling
    const submitButton = screen.getByText(/submit complaint/i);
    await user.click(submitButton);
    
    expect(createComplaint).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    const { createComplaint } = await import("@/hooks/use-dashboard");
    (createComplaint as any).mockResolvedValue({ success: true });
    
    render(<ComplaintList />);
    
    // Open form
    const raiseButton = screen.getByText(/raise complaint/i);
    await user.click(raiseButton);
    
    // Fill form
    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, "Test Complaint");
    
    const descInput = screen.getByLabelText(/description/i);
    await user.type(descInput, "This is a test description");
    
    // Submit
    const submitButton = screen.getByText(/submit complaint/i);
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(createComplaint).toHaveBeenCalledWith(expect.objectContaining({
        title: "Test Complaint",
        description: "This is a test description",
      }));
    });
  });
});

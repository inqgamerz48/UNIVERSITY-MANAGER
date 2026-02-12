import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NoticeManagement } from "@/components/notice-management";
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
  useNotices: vi.fn(() => ({ notices: [], loading: false })),
  createNotice: vi.fn(),
}));

describe("NoticeManagement Component", () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: "user-1" } } })),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as any).mockReturnValue(mockSupabase);
    (useAuthStore as any).mockReturnValue({
      user: { id: "user-1", email: "admin@test.com", role: "ADMIN" },
    });
  });

  it("renders notice management page", () => {
    render(<NoticeManagement />);
    expect(screen.getByText(/notices/i)).toBeInTheDocument();
    expect(screen.getByText(/manage and publish notices/i)).toBeInTheDocument();
  });

  it("opens publish dialog when button clicked", async () => {
    const user = userEvent.setup();
    render(<NoticeManagement />);
    
    const publishButton = screen.getByText(/publish notice/i);
    await user.click(publishButton);
    
    expect(screen.getByText(/publish new notice/i)).toBeInTheDocument();
  });

  it("shows empty state when no notices", async () => {
    render(<NoticeManagement />);
    
    await waitFor(() => {
      expect(screen.getByText(/no notices/i)).toBeInTheDocument();
    });
  });

  it("displays notices with correct priority badges", async () => {
    const { useNotices } = await import("@/hooks/use-dashboard");
    (useNotices as any).mockReturnValue({
      notices: [
        {
          id: "1",
          title: "Urgent Notice",
          content: "Important content",
          priority: "high",
          category: "exam",
          published_at: "2026-02-12T00:00:00Z",
          published_by_name: "Admin",
        },
      ],
      loading: false,
    });

    render(<NoticeManagement />);
    
    await waitFor(() => {
      expect(screen.getByText("Urgent Notice")).toBeInTheDocument();
      expect(screen.getByText(/high priority/i)).toBeInTheDocument();
    });
  });

  it("shows category badges correctly", async () => {
    const { useNotices } = await import("@/hooks/use-dashboard");
    (useNotices as any).mockReturnValue({
      notices: [
        {
          id: "1",
          title: "Exam Schedule",
          content: "Exam details",
          priority: "normal",
          category: "exam",
          published_at: "2026-02-12T00:00:00Z",
          published_by_name: "Admin",
        },
      ],
      loading: false,
    });

    render(<NoticeManagement />);
    
    await waitFor(() => {
      expect(screen.getByText(/exam/i)).toBeInTheDocument();
    });
  });

  it("validates form before publishing", async () => {
    const user = userEvent.setup();
    const { createNotice } = await import("@/hooks/use-dashboard");
    
    render(<NoticeManagement />);
    
    // Open dialog
    const publishButton = screen.getByText(/publish notice/i);
    await user.click(publishButton);
    
    // Try to submit without title
    const submitButton = screen.getByText(/publish notice$/i);
    await user.click(submitButton);
    
    // Should show validation error
    expect(createNotice).not.toHaveBeenCalled();
  });
});

describe("NoticeManagement Accessibility", () => {
  it("has accessible form elements", async () => {
    const user = userEvent.setup();
    render(<NoticeManagement />);
    
    const publishButton = screen.getByText(/publish notice/i);
    await user.click(publishButton);
    
    // Check for accessible labels
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });

  it("closes dialog on cancel", async () => {
    const user = userEvent.setup();
    render(<NoticeManagement />);
    
    // Open dialog
    const publishButton = screen.getByText(/publish notice/i);
    await user.click(publishButton);
    
    // Close dialog
    const cancelButton = screen.getByText(/cancel/i);
    await user.click(cancelButton);
    
    // Dialog should be closed
    await waitFor(() => {
      expect(screen.queryByText(/publish new notice/i)).not.toBeInTheDocument();
    });
  });
});

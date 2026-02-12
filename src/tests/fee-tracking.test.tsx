import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { FeeTracking } from "@/components/fee-tracking";
import { useAuthStore } from "@/stores/auth-store";
import { createClient } from "@/lib/supabase/client";

// Mock dependencies
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/stores/auth-store", () => ({
  useAuthStore: vi.fn(),
}));

describe("FeeTracking Component", () => {
  const mockSupabase = {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: "student-1" } })),
        })),
        order: vi.fn(() => Promise.resolve({ data: [] })),
      })),
    })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as any).mockReturnValue(mockSupabase);
    (useAuthStore as any).mockReturnValue({
      user: { id: "student-1", email: "student@test.com", role: "STUDENT" },
    });
  });

  it("renders fee tracking page", () => {
    render(<FeeTracking />);
    expect(screen.getByText(/fee management/i)).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    render(<FeeTracking />);
    const loaders = screen.getAllByRole("generic").filter(el => 
      el.className.includes("animate-pulse")
    );
    expect(loaders.length).toBeGreaterThan(0);
  });

  it("displays fee summary cards", async () => {
    const mockPayments = [
      {
        id: "1",
        amount: 50000,
        status: "PAID",
        due_date: "2026-03-01",
        paid_at: "2026-02-01",
        fee_structure: { name: "Tuition Fee", category: "tuition" },
      },
      {
        id: "2",
        amount: 5000,
        status: "PENDING",
        due_date: "2026-04-01",
        fee_structure: { name: "Exam Fee", category: "exam" },
      },
    ];

    mockSupabase.from = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: "student-1" } })),
          order: vi.fn(() => Promise.resolve({ data: mockPayments })),
        })),
      })),
    }));

    render(<FeeTracking />);
    
    await waitFor(() => {
      expect(screen.getByText(/₹50,000/i)).toBeInTheDocument();
    });
  });

  it("shows payment progress bar", async () => {
    const mockPayments = [
      {
        id: "1",
        amount: 100,
        status: "PAID",
        due_date: "2026-03-01",
        paid_at: "2026-02-01",
        fee_structure: { name: "Fee 1", category: "tuition" },
      },
      {
        id: "2",
        amount: 100,
        status: "PENDING",
        due_date: "2026-04-01",
        fee_structure: { name: "Fee 2", category: "exam" },
      },
    ];

    mockSupabase.from = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: "student-1" } })),
          order: vi.fn(() => Promise.resolve({ data: mockPayments })),
        })),
      })),
    }));

    render(<FeeTracking />);
    
    await waitFor(() => {
      expect(screen.getByText(/50% complete/i)).toBeInTheDocument();
    });
  });

  it("shows overdue badge for late payments", async () => {
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - 10);

    const mockPayments = [
      {
        id: "1",
        amount: 5000,
        status: "PENDING",
        due_date: overdueDate.toISOString(),
        fee_structure: { name: "Overdue Fee", category: "tuition" },
      },
    ];

    mockSupabase.from = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: "student-1" } })),
          order: vi.fn(() => Promise.resolve({ data: mockPayments })),
        })),
      })),
    }));

    render(<FeeTracking />);
    
    await waitFor(() => {
      expect(screen.getByText(/overdue/i)).toBeInTheDocument();
    });
  });

  it("shows empty state when no fee records", async () => {
    mockSupabase.from = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: "student-1" } })),
          order: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      })),
    }));

    render(<FeeTracking />);
    
    await waitFor(() => {
      expect(screen.getByText(/no fee records/i)).toBeInTheDocument();
    });
  });

  it("displays paid fees with checkmark", async () => {
    const mockPayments = [
      {
        id: "1",
        amount: 50000,
        status: "PAID",
        due_date: "2026-03-01",
        paid_at: "2026-02-01",
        fee_structure: { name: "Paid Fee", category: "tuition" },
      },
    ];

    mockSupabase.from = vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: "student-1" } })),
          order: vi.fn(() => Promise.resolve({ data: mockPayments })),
        })),
      })),
    }));

    render(<FeeTracking />);
    
    await waitFor(() => {
      expect(screen.getByText(/paid/i)).toBeInTheDocument();
      expect(screen.getByText(/paid on/i)).toBeInTheDocument();
    });
  });
});

describe("FeeTracking Error Handling", () => {
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
      user: { id: "student-1", email: "student@test.com", role: "STUDENT" },
    });

    render(<FeeTracking />);
    
    await waitFor(() => {
      expect(screen.getByText(/no fee records/i)).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });
});

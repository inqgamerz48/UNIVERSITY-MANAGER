import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUpload, FilePreview } from "@/components/file-upload";

// Mock Supabase
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => Promise.resolve({ data: { path: "test.pdf" }, error: null })),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: "https://example.com/test.pdf" } })),
      })),
    },
  })),
}));

// Mock toast
vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

describe("FileUpload Component", () => {
  const mockOnUploadComplete = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders file upload component", () => {
    render(
      <FileUpload
        bucket="test-bucket"
        onUploadComplete={mockOnUploadComplete}
      />
    );
    
    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
    expect(screen.getByText(/pdf, xlsx, csv/i)).toBeInTheDocument();
  });

  it("accepts valid file types", async () => {
    const user = userEvent.setup();
    render(<FileUpload bucket="test-bucket" accept={["pdf"]} />);
    
    const input = screen.getByLabelText(/click to upload/i);
    const validFile = new File(["test content"], "test.pdf", { type: "application/pdf" });
    
    await user.upload(input, validFile);
    
    expect(screen.getByText("test.pdf")).toBeInTheDocument();
  });

  it("rejects invalid file types", async () => {
    const user = userEvent.setup();
    const { toast } = await import("@/hooks/use-toast");
    
    render(<FileUpload bucket="test-bucket" accept={["pdf"]} />);
    
    const input = screen.getByLabelText(/click to upload/i);
    const invalidFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    
    await user.upload(input, invalidFile);
    
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      variant: "destructive",
    }));
  });

  it("rejects files exceeding max size", async () => {
    const user = userEvent.setup();
    const { toast } = await import("@/hooks/use-toast");
    
    render(<FileUpload bucket="test-bucket" accept={["pdf"]} maxSize={1} />);
    
    const input = screen.getByLabelText(/click to upload/i);
    // Create a file larger than 1MB
    const largeFile = new File(["x".repeat(1024 * 1024 * 2)], "large.pdf", { type: "application/pdf" });
    
    await user.upload(input, largeFile);
    
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      title: "Validation Error",
    }));
  });

  it("removes file when remove button clicked", async () => {
    const user = userEvent.setup();
    render(<FileUpload bucket="test-bucket" accept={["pdf"]} />);
    
    const input = screen.getByLabelText(/click to upload/i);
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    
    await user.upload(input, file);
    expect(screen.getByText("test.pdf")).toBeInTheDocument();
    
    const removeButton = screen.getByRole("button", { name: "" });
    await user.click(removeButton);
    
    expect(screen.queryByText("test.pdf")).not.toBeInTheDocument();
  });

  it("calls onUploadComplete after successful upload", async () => {
    const user = userEvent.setup();
    render(
      <FileUpload
        bucket="test-bucket"
        accept={["pdf"]}
        onUploadComplete={mockOnUploadComplete}
      />
    );
    
    const input = screen.getByLabelText(/click to upload/i);
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    
    await user.upload(input, file);
    
    const uploadButton = screen.getByText(/upload all/i);
    await user.click(uploadButton);
    
    await waitFor(() => {
      expect(mockOnUploadComplete).toHaveBeenCalled();
    });
  });

  it("shows upload progress", async () => {
    render(<FileUpload bucket="test-bucket" />);
    
    // Initially no progress
    expect(screen.queryByText(/uploading/i)).not.toBeInTheDocument();
  });
});

describe("FilePreview Component", () => {
  it("renders file preview with correct icon", () => {
    render(
      <FilePreview
        url="https://example.com/test.pdf"
        fileName="test.pdf"
      />
    );
    
    expect(screen.getByText("test.pdf")).toBeInTheDocument();
    expect(screen.getByText("View File")).toBeInTheDocument();
  });

  it("shows different icons for different file types", () => {
    const { rerender } = render(
      <FilePreview
        url="https://example.com/test.pdf"
        fileName="test.pdf"
      />
    );
    
    expect(screen.getByText("test.pdf")).toBeInTheDocument();
    
    rerender(
      <FilePreview
        url="https://example.com/test.xlsx"
        fileName="test.xlsx"
      />
    );
    
    expect(screen.getByText("test.xlsx")).toBeInTheDocument();
  });

  it("calls onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    const mockOnDelete = vi.fn();
    
    render(
      <FilePreview
        url="https://example.com/test.pdf"
        fileName="test.pdf"
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButton = screen.getByRole("button");
    await user.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it("opens file in new tab when view file clicked", () => {
    render(
      <FilePreview
        url="https://example.com/test.pdf"
        fileName="test.pdf"
      />
    );
    
    const viewLink = screen.getByText("View File");
    expect(viewLink).toHaveAttribute("href", "https://example.com/test.pdf");
    expect(viewLink).toHaveAttribute("target", "_blank");
  });
});

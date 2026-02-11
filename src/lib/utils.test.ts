import { render, screen } from "@testing-library/react";
import { cn, formatDate, formatDateTime, formatRelativeTime, getInitials, truncate, slugify, getRoleDashboardPath, getRoleLabel } from "@/lib/utils";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      const result = cn("base-class", "extra-class");
      expect(result).toContain("base-class");
      expect(result).toContain("extra-class");
    });

    it("handles conditional classes", () => {
      const result = cn("base", true && "conditional", false && "hidden");
      expect(result).toContain("base");
      expect(result).toContain("conditional");
      expect(result).not.toContain("hidden");
    });

    it("handles tailwind merge", () => {
      const result = cn("p-2 p-4");
      expect(result).toBe("p-4");
    });
  });

  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2026-02-15");
      const result = formatDate(date);
      expect(result).toContain("February");
      expect(result).toContain("15");
      expect(result).toContain("2026");
    });

    it("handles string date input", () => {
      const result = formatDate("2026-02-15");
      expect(result).toContain("February");
    });
  });

  describe("formatDateTime", () => {
    it("formats datetime correctly", () => {
      const result = formatDateTime("2026-02-15T10:30:00");
      expect(result).toContain("Feb");
      expect(result).toContain("15");
      expect(result).toContain("10:");
    });
  });

  describe("formatRelativeTime", () => {
    it("returns 'just now' for recent times", () => {
      const result = formatRelativeTime(new Date());
      expect(result).toBe("just now");
    });

    it("returns minutes ago", () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatRelativeTime(fiveMinutesAgo);
      expect(result).toContain("m ago");
    });

    it("returns hours ago", () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoHoursAgo);
      expect(result).toContain("h ago");
    });

    it("returns days ago", () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(threeDaysAgo);
      expect(result).toContain("d ago");
    });
  });

  describe("getInitials", () => {
    it("returns initials from full name", () => {
      expect(getInitials("John Doe")).toBe("JD");
    });

    it("handles single name", () => {
      expect(getInitials("John")).toBe("J");
    });

    it("handles multiple names", () => {
      expect(getInitials("John Michael Doe")).toBe("JM");
    });
  });

  describe("truncate", () => {
    it("truncates long strings", () => {
      const result = truncate("This is a very long string", 10);
      expect(result).toBe("This is a ...");
    });

    it("returns full string if shorter than limit", () => {
      const result = truncate("Short", 10);
      expect(result).toBe("Short");
    });
  });

  describe("slugify", () => {
    it("converts text to slug", () => {
      expect(slugify("Hello World")).toBe("hello-world");
    });

    it("handles special characters", () => {
      expect(slugify("Test@#$%")).toBe("test");
    });

    it("handles multiple spaces", () => {
      expect(slugify("hello   world")).toBe("hello-world");
    });
  });

  describe("getRoleDashboardPath", () => {
    it("returns student dashboard path", () => {
      expect(getRoleDashboardPath("STUDENT")).toBe("/student/dashboard");
    });

    it("returns faculty dashboard path", () => {
      expect(getRoleDashboardPath("FACULTY")).toBe("/faculty/dashboard");
    });

    it("returns admin dashboard path", () => {
      expect(getRoleDashboardPath("ADMIN")).toBe("/admin/dashboard");
    });

    it("returns super admin dashboard path", () => {
      expect(getRoleDashboardPath("SUPER_ADMIN")).toBe("/admin/dashboard");
    });

    it("returns login for unknown roles", () => {
      expect(getRoleDashboardPath("UNKNOWN")).toBe("/login");
    });
  });

  describe("getRoleLabel", () => {
    it("returns correct role labels", () => {
      expect(getRoleLabel("STUDENT")).toBe("Student");
      expect(getRoleLabel("FACULTY")).toBe("Faculty");
      expect(getRoleLabel("ADMIN")).toBe("Administrator");
      expect(getRoleLabel("SUPER_ADMIN")).toBe("Super Admin");
    });

    it("returns User for unknown roles", () => {
      expect(getRoleLabel("UNKNOWN")).toBe("User");
    });
  });
});

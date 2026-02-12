"use client";

import { ComplaintList } from "@/components/complaint-list";

export default function AdminComplaintsPage() {
  return <ComplaintList isAdmin={true} />;
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calendar, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ReportType = "ATTENDANCE" | "FEES" | "GRADES";

export default function AdminReportsPage() {
    const [reportType, setReportType] = useState<ReportType>("ATTENDANCE");
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const generateReport = async () => {
        setLoading(true);
        try {
            const doc = new jsPDF();
            const date = new Date().toLocaleDateString();

            // Header
            doc.setFontSize(20);
            doc.text("UNI Manager Report", 14, 22);
            doc.setFontSize(12);
            doc.text(`Generated on: ${date}`, 14, 32);

            if (reportType === "ATTENDANCE") {
                doc.text("Student Attendance Report - Monthly Summary", 14, 40);

                // Fetch data
                const { data: attendance, error } = await supabase
                    .from("attendance")
                    .select("date, status, student:students(pin_number, user:users(profiles(full_name)))")
                    .order("date", { ascending: false })
                    .limit(100);

                if (error) throw error;

                const tableData = attendance.map((r: any) => [
                    new Date(r.date).toLocaleDateString(),
                    r.student?.user?.profiles?.full_name || "Unknown",
                    r.student?.pin_number || "N/A",
                    r.status
                ]);

                autoTable(doc, {
                    head: [["Date", "Student Name", "PIN", "Status"]],
                    body: tableData,
                    startY: 45,
                });

            } else if (reportType === "FEES") {
                doc.text("Fee Collection Report", 14, 40);

                const { data: payments, error } = await supabase
                    .from("fee_payments")
                    .select("amount, status, paid_at, student:students(pin_number, user:users(profiles(full_name)))")
                    .eq("status", "PAID")
                    .order("paid_at", { ascending: false })
                    .limit(100);

                if (error) throw error;

                const tableData = payments.map((r: any) => [
                    r.student?.user?.profiles?.full_name || "Unknown",
                    r.student?.pin_number || "N/A",
                    `$${r.amount}`,
                    new Date(r.paid_at).toLocaleDateString()
                ]);

                autoTable(doc, {
                    head: [["Student Name", "PIN", "Amount", "Paid Date"]],
                    body: tableData,
                    startY: 45,
                });
            }

            doc.save(`report_${reportType.toLowerCase()}_${Date.now()}.pdf`);
            toast({ title: "Success", description: "Report downloaded successfully" });

        } catch (error: any) {
            console.error("Report error:", error);
            toast({ title: "Error", description: "Failed to generate report", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Reports</h1>
                <p className="text-muted-foreground">Generate and export system reports</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="glass-card col-span-full md:col-span-1">
                    <CardHeader>
                        <CardTitle>Generate Report</CardTitle>
                        <CardDescription>Select parameters for your report</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Report Type</label>
                            <Select value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ATTENDANCE">Attendance Summary</SelectItem>
                                    <SelectItem value="FEES">Fee Collection</SelectItem>
                                    <SelectItem value="GRADES">Academic Grades</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="w-full gold" onClick={generateReport} disabled={loading}>
                            <Download className="mr-2 h-4 w-4" />
                            {loading ? "Generating..." : "Download PDF"}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="glass-card col-span-full md:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Reports</CardTitle>
                        <CardDescription>History of generated reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <FileText className="h-12 w-12 mb-4 opacity-50" />
                            <p>No reports generated in this session</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

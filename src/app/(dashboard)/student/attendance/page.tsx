"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useStudentAttendance } from "@/hooks/use-dashboard"; // We might need to enhance this hook or call action directly
import { getStudentAttendance } from "@/actions/attendance-actions"; // Use the action I just updated
import { useAuthStore } from "@/stores/auth-store";
import { createClient } from "@/lib/supabase/client";

interface AttendanceRecord {
    id: string;
    date: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
    subject: {
        name: string;
        code: string;
    };
}

export default function StudentAttendancePage() {
    const { user } = useAuthStore();
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const supabase = createClient();

    useEffect(() => {
        async function fetchAttendance() {
            setLoading(true);
            if (!user) return;

            // Get student ID first
            const { data: student } = await supabase
                .from("students")
                .select("id")
                .eq("user_id", user.id)
                .single();

            if (!student) {
                setLoading(false);
                return;
            }

            const result = await getStudentAttendance(student.id, selectedMonth);
            if (result.data) {
                setRecords(result.data as any);
            }
            setLoading(false);
        }

        if (user) fetchAttendance();
    }, [user, selectedMonth, supabase]);

    const totalClasses = records.length;
    const presentClasses = records.filter(r => r.status === "PRESENT").length;
    const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PRESENT": return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Present</Badge>;
            case "ABSENT": return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Absent</Badge>;
            case "LATE": return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Late</Badge>;
            case "EXCUSED": return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Excused</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return d.toISOString().slice(0, 7);
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">My Attendance</h1>
                    <p className="text-muted-foreground">Track your daily attendance record</p>
                </div>

                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map(m => (
                            <SelectItem key={m} value={m}>
                                {new Date(m + "-01").toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card className="glass-card md:col-span-2">
                    <CardHeader>
                        <CardTitle>Attendance Overview</CardTitle>
                        <CardDescription>Performance for {new Date(selectedMonth + "-01").toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Total Attendance</span>
                                    <span className={`font-bold ${percentage < 75 ? "text-red-500" : "text-green-500"}`}>{percentage}%</span>
                                </div>
                                <Progress value={percentage} className="h-3" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{totalClasses}</p>
                                <p className="text-xs text-muted-foreground">Total Classes</p>
                            </div>
                            <div className="text-center text-green-500">
                                <p className="text-2xl font-bold">{presentClasses}</p>
                                <p className="text-xs text-muted-foreground">Present</p>
                            </div>
                            <div className="text-center text-red-500">
                                <p className="text-2xl font-bold">{records.filter(r => r.status === "ABSENT").length}</p>
                                <p className="text-xs text-muted-foreground">Absent</p>
                            </div>
                            <div className="text-center text-yellow-500">
                                <p className="text-2xl font-bold">{records.filter(r => r.status === "LATE" || r.status === "EXCUSED").length}</p>
                                <p className="text-xs text-muted-foreground">Other</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card flex items-center justify-center">
                    <CardContent className="pt-6 text-center">
                        {percentage < 75 ? (
                            <div className="space-y-2">
                                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                                <h3 className="font-bold text-red-500">Low Attendance!</h3>
                                <p className="text-sm text-muted-foreground">You are below the 75% threshold. Please attend more classes.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                                <h3 className="font-bold text-green-500">Good Standing</h3>
                                <p className="text-sm text-muted-foreground">Keep up the good work! You are eligible for exams.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Daily Log</CardTitle>
                    <CardDescription>Detailed list of attendance records</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded" />)}
                        </div>
                    ) : records.length > 0 ? (
                        <div className="space-y-2">
                            {records.map(record => (
                                <div key={record.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${record.status === "PRESENT" ? "bg-green-500/10 text-green-500" :
                                                record.status === "ABSENT" ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"
                                            }`}>
                                            {record.status === "PRESENT" ? <CheckCircle className="h-5 w-5" /> :
                                                record.status === "ABSENT" ? <XCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{record.subject?.name || "Unknown Subject"}</h3>
                                            <p className="text-xs text-muted-foreground">{record.subject?.code}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{new Date(record.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</p>
                                        {getStatusBadge(record.status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No attendance records found for this month</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

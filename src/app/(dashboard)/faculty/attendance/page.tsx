"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useFacultyClasses } from "@/hooks/use-dashboard";
import { useAuthStore } from "@/stores/auth-store";
import { CalendarDays, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function AttendancePage() {
  const { user } = useAuthStore();
  const { classes, loading } = useFacultyClasses();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">Mark attendance for your classes</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Classes
            </CardTitle>
            <CardDescription>Select a class to mark attendance</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : classes.length > 0 ? (
              <div className="space-y-4">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedClass === cls.id
                        ? "border-gold-500 bg-gold-500/10"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedClass(cls.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{cls.subject_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cls.branch_name} • {cls.semester} • {cls.total_students} students
                        </p>
                      </div>
                      <Badge variant="outline">{cls.subject_code}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No classes assigned</p>
                <p className="text-sm">Contact admin to assign subjects</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedClass && (
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>
              {selectedDate.toLocaleDateString()} - Click to toggle attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Student list will appear here</p>
              <p className="text-sm">Feature coming soon</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

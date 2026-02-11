"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Bell, Clock, TrendingUp, User, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const upcomingAssignments = [
  { id: 1, title: "Database Systems Project", subject: "CS301", dueDate: "2026-02-15", daysLeft: 4 },
  { id: 2, title: "Operating Systems Lab", subject: "CS305", dueDate: "2026-02-18", daysLeft: 7 },
  { id: 3, title: "Web Development Assignment", subject: "CS401", dueDate: "2026-02-20", daysLeft: 9 },
];

const recentNotices = [
  { id: 1, title: "Mid-Semester Exams Schedule", category: "academic", date: "2026-02-10" },
  { id: 2, title: "Library Book Renewal Notice", category: "general", date: "2026-02-08" },
  { id: 3, title: "Hackathon 2026 Registration", category: "event", date: "2026-02-05" },
];

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg gold-gradient flex items-center justify-center">
              <span className="text-black font-bold">U</span>
            </div>
            <span className="font-bold text-lg">Student Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-gold-500 text-black">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Assignments</p>
                  <p className="text-3xl font-bold">5</p>
                  <p className="text-xs text-gold-500">3 due this week</p>
                </div>
                <FileText className="h-10 w-10 text-gold-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                  <p className="text-3xl font-bold">92%</p>
                  <p className="text-xs text-green-500">Excellent</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground"> GPA</p>
                  <p className="text-3xl font-bold">8.5</p>
                  <p className="text-xs text-green-500">+0.2 this semester</p>
                </div>
                <BookOpen className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Notices</p>
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-xs text-blue-500">3 unread</p>
                </div>
                <Bell className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mt-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gold-500" />
                <span>Upcoming Assignments</span>
              </CardTitle>
              <CardDescription>Your pending assignments and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={assignment.daysLeft <= 5 ? "destructive" : "secondary"}>
                        {assignment.daysLeft} days left
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-500" />
                <span>Recent Notices</span>
              </CardTitle>
              <CardDescription>Latest announcements and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotices.map((notice) => (
                  <div key={notice.id} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{notice.title}</p>
                      <Badge variant="outline">{notice.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{notice.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

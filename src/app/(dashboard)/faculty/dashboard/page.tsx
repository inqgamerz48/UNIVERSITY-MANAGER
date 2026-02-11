"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, BookOpen, TrendingUp, Bell, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const stats = [
  { label: "Total Students", value: "156", change: "+12%", icon: Users, color: "text-blue-500" },
  { label: "Pending Reviews", value: "28", change: "-5%", icon: FileText, color: "text-orange-500" },
  { label: "Subjects", value: "4", change: "0", icon: BookOpen, color: "text-green-500" },
  { label: "Avg Attendance", value: "94%", change: "+2%", icon: TrendingUp, color: "text-gold-500" },
];

const pendingSubmissions = [
  { id: 1, student: "John Doe", assignment: "Database Project", subject: "CS301", submittedAt: "2026-02-10" },
  { id: 2, student: "Jane Smith", assignment: "OS Lab", subject: "CS305", submittedAt: "2026-02-09" },
  { id: 3, student: "Mike Johnson", assignment: "Web Dev", subject: "CS401", submittedAt: "2026-02-08" },
];

export default function FacultyDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg gold-gradient flex items-center justify-center">
              <span className="text-black font-bold">U</span>
            </div>
            <span className="font-bold text-lg">Faculty Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="gold">
              <Plus className="h-4 w-4 mr-2" />
              New Assignment
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-gold-500 text-black">PD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-500">{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mt-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gold-500" />
                <span>Pending Submissions</span>
              </CardTitle>
              <CardDescription>Assignments awaiting your review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingSubmissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-gold-500/20 text-gold-400">
                          {submission.student.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{submission.student}</p>
                        <p className="text-sm text-muted-foreground">{submission.assignment} - {submission.subject}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Review</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>Class Performance</span>
              </CardTitle>
              <CardDescription>Average scores by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["CS301 - Database Systems", "CS305 - Operating Systems", "CS401 - Web Development", "CS405 - Algorithms"].map((subject, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{subject}</span>
                      <span className="text-gold-500 font-semibold">{75 + Math.random() * 20}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="gold-gradient h-2 rounded-full" style={{ width: `${75 + Math.random() * 20}%` }} />
                    </div>
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

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building, FileText, TrendingUp, Settings, Bell, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const stats = [
  { label: "Total Users", value: "1,234", change: "+156", icon: Users, color: "text-blue-500" },
  { label: "Faculties", value: "45", change: "+3", icon: Building, color: "text-green-500" },
  { label: "Active Courses", value: "89", change: "+8", icon: FileText, color: "text-gold-500" },
  { label: "System Uptime", value: "99.9%", change: "0%", icon: TrendingUp, color: "text-purple-500" },
];

const recentActivity = [
  { id: 1, action: "New student registered", user: "Rahul Kumar", time: "5 minutes ago", type: "student" },
  { id: 2, action: "Faculty account created", user: "Dr. Sarah Smith", time: "1 hour ago", type: "faculty" },
  { id: 3, action: "Complaint resolved", user: "System Admin", time: "2 hours ago", type: "complaint" },
  { id: 4, action: "New notice published", user: "Dr. John Davis", time: "3 hours ago", type: "notice" },
];

const systemHealth = [
  { service: "Database", status: "healthy", latency: "12ms" },
  { service: "API", status: "healthy", latency: "45ms" },
  { service: "Storage", status: "healthy", latency: "23ms" },
  { service: "Auth Service", status: "healthy", latency: "8ms" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg gold-gradient flex items-center justify-center">
              <span className="text-black font-bold">U</span>
            </div>
            <span className="font-bold text-lg">Admin Dashboard</span>
            <Badge variant="outline" className="ml-2">Super Admin</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-gold-500 text-black">AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Overview</h1>
            <p className="text-muted-foreground">Welcome back, Admin</p>
          </div>
          <Button className="gold">
            <Shield className="h-4 w-4 mr-2" />
            Manage Access
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-500">{stat.change} this month</p>
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
                <TrendingUp className="h-5 w-5 text-gold-500" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest actions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gold-500/20 text-gold-400">
                        {activity.user.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>System Health</span>
              </CardTitle>
              <CardDescription>Real-time system status and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <div className={`h-3 w-3 rounded-full ${service.status === "healthy" ? "bg-green-500" : "bg-red-500"}`} />
                      <span className="font-medium">{service.service}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="success">{service.status}</Badge>
                      <span className="text-sm text-muted-foreground">{service.latency}</span>
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

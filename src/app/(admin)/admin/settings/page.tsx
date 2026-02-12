"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Bell, Database, Palette } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage system configuration</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Security and authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="2fa">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
              </div>
              <Switch id="2fa" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="session">Session Timeout</Label>
                <p className="text-sm text-muted-foreground">Auto logout after 30 minutes</p>
              </div>
              <Switch id="session" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email for important events</p>
              </div>
              <Switch id="email-notif" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notif">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Send SMS for urgent alerts</p>
              </div>
              <Switch id="sms-notif" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup
            </CardTitle>
            <CardDescription>Database backup settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-backup">Automatic Backups</Label>
                <p className="text-sm text-muted-foreground">Daily database backups</p>
              </div>
              <Switch id="auto-backup" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PERMISSIONS, ROLE_HIERARCHY, type Role } from "@/lib/rbac";
import { createAuditLog } from "@/lib/audit";
import { Users, Shield, Activity, CheckCircle, XCircle, Search, Filter, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { ErrorBoundary } from "@/components/error-boundary";

interface UserWithRole {
  id: string;
  email: string;
  role: Role;
  full_name: string;
  created_at: string;
}

interface RoleStats {
  role: Role;
  count: number;
}

export default function RBACManagementPage() {
  const [users, setUsers] = React.useState<UserWithRole[]>([]);
  const [stats, setStats] = React.useState<RoleStats[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = React.useState<Role>("STUDENT");
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/stats"),
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.roleStats || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast({ title: "Success", description: "User role updated successfully" });
        createAuditLog({
          action: "update",
          entity_type: "user_role",
          entity_id: selectedUser.id,
          new_values: { role: newRole },
        });
        fetchData();
        setSelectedUser(null);
      } else {
        throw new Error("Failed to update role");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update user role", variant: "destructive" });
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleColors: Record<Role, string> = {
    STUDENT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    FACULTY: "bg-green-500/10 text-green-400 border-green-500/20",
    ADMIN: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    SUPER_ADMIN: "bg-gold-500/10 text-gold-400 border-gold-500/20",
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* ... existing RBAC page content ... */}
        <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg gold-gradient flex items-center justify-center">
                <span className="text-black font-bold">U</span>
              </div>
              <span className="font-bold text-lg">RBAC Management</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold gold-text mb-2">Role-Based Access Control</h1>
            <p className="text-muted-foreground">Manage user roles and permissions</p>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="permissions">
                <Shield className="h-4 w-4 mr-2" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="h-4 w-4 mr-2" />
                Activity Log
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>User Role Management</CardTitle>
                  <CardDescription>View and manage user roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button className="gold" onClick={() => setShowCreateDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    {stats.map((stat) => (
                      <div key={stat.role} className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{stat.role}</span>
                          <Badge className={roleColors[stat.role as Role]}>{stat.count}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24">
                            <div className="flex justify-center items-center w-full">
                              <div className="space-y-4 w-full">
                                <div className="flex items-center justify-between">
                                  <div className="h-8 w-[200px] bg-muted/50 rounded animate-pulse" />
                                  <div className="h-8 w-[100px] bg-muted/50 rounded animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-12 w-full bg-muted/20 rounded animate-pulse" />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.full_name || "N/A"}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge className={roleColors[user.role as Role]}>{user.role}</Badge>
                            </TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => {
                                    setSelectedUser(user);
                                    setNewRole(user.role);
                                  }}>
                                    Edit Role
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Update User Role</DialogTitle>
                                    <DialogDescription>
                                      Change role for {user.email}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label>Current Role</Label>
                                      <Badge className={roleColors[user.role as Role]}>{user.role}</Badge>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>New Role</Label>
                                      <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="STUDENT">Student</SelectItem>
                                          <SelectItem value="FACULTY">Faculty</SelectItem>
                                          <SelectItem value="ADMIN">Admin</SelectItem>
                                          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    {ROLE_HIERARCHY[newRole]?.length > 0 && (
                                      <div className="p-3 rounded-lg bg-muted/50">
                                        <p className="text-sm font-medium mb-1">Inherits from:</p>
                                        <div className="flex gap-2">
                                          {ROLE_HIERARCHY[newRole].map((role) => (
                                            <Badge key={role} variant="outline">{role}</Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setSelectedUser(null)}>Cancel</Button>
                                    <Button className="gold" onClick={updateUserRole}>Update Role</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Permission Matrix</CardTitle>
                  <CardDescription>View all permissions by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(PERMISSIONS).map(([code, perm]) => (
                      <div key={code} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{perm.category}</Badge>
                          <code className="text-xs text-muted-foreground">{code}</code>
                        </div>
                        <h4 className="font-medium mb-1">{perm.name}</h4>
                        <p className="text-sm text-muted-foreground">{perm.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>View audit logs and user activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-8 text-center text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Activity logs will be displayed here</p>
                    <p className="text-sm">Enable audit logging to track user actions</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <CreateUserDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={fetchData}
        />
      </div>
    </ErrorBoundary>
  );
}

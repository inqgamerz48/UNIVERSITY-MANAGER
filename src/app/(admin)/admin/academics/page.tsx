"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Building, BookOpen } from "lucide-react";
import { useBranches, useSubjects } from "@/hooks/use-dashboard";
import { CreateBranchDialog, CreateSubjectDialog } from "@/components/admin/academic-dialogs";

export default function AcademicsPage() {
    const { branches, loading: branchesLoading } = useBranches();
    const { subjects, loading: subjectsLoading } = useSubjects();

    const [showBranchDialog, setShowBranchDialog] = useState(false);
    const [showSubjectDialog, setShowSubjectDialog] = useState(false);
    const [activeTab, setActiveTab] = useState("departments");

    // Simple manual refresh hack: in real app use query invalidation
    // For now, we rely on page refresh or optimistic updates.
    // We'll pass a "onSuccess" that reloads the page.
    const handleSuccess = () => {
        window.location.reload();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold gold-text">Academic Management</h1>
                    <p className="text-muted-foreground">Manage departments and curriculum</p>
                </div>
                <Button
                    className="gold"
                    onClick={() => activeTab === 'departments' ? setShowBranchDialog(true) : setShowSubjectDialog(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add {activeTab === 'departments' ? 'Department' : 'Subject'}
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="departments">
                        <Building className="h-4 w-4 mr-2" />
                        Departments (Branches)
                    </TabsTrigger>
                    <TabsTrigger value="subjects">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Subjects
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="departments" className="mt-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Departments</CardTitle>
                            <CardDescription>All academic branches in the university</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {branchesLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded" />)}
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {branches.map(branch => (
                                        <div key={branch.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="outline">{branch.code}</Badge>
                                                <Badge>{branch.course_type}</Badge>
                                            </div>
                                            <h3 className="font-bold text-lg mb-1">{branch.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{branch.description || "No description"}</p>
                                            <div className="text-xs text-muted-foreground">
                                                Duration: {branch.duration_semesters} Semesters
                                            </div>
                                        </div>
                                    ))}
                                    {branches.length === 0 && (
                                        <div className="col-span-full text-center py-8 text-muted-foreground">
                                            No departments found. Create one to get started.
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="subjects" className="mt-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Subjects</CardTitle>
                            <CardDescription>Curriculum subjects across all branches</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {subjectsLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded" />)}
                                </div>
                            ) : (
                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="p-3 text-left font-medium">Code</th>
                                                <th className="p-3 text-left font-medium">Name</th>
                                                <th className="p-3 text-left font-medium">Branch</th>
                                                <th className="p-3 text-left font-medium">Type</th>
                                                <th className="p-3 text-left font-medium">Sem</th>
                                                <th className="p-3 text-left font-medium">Credits</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subjects.map(subject => (
                                                <tr key={subject.id} className="border-t hover:bg-muted/50">
                                                    <td className="p-3 font-mono">{subject.code}</td>
                                                    <td className="p-3 font-medium">{subject.name}</td>
                                                    <td className="p-3">{subject.branch?.name || "-"}</td>
                                                    <td className="p-3"><Badge variant="outline">{subject.type}</Badge></td>
                                                    <td className="p-3">{subject.semester}</td>
                                                    <td className="p-3">{subject.credits}</td>
                                                </tr>
                                            ))}
                                            {subjects.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                        No subjects found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <CreateBranchDialog
                open={showBranchDialog}
                onOpenChange={setShowBranchDialog}
                onSuccess={handleSuccess}
            />

            <CreateSubjectDialog
                open={showSubjectDialog}
                onOpenChange={setShowSubjectDialog}
                onSuccess={handleSuccess}
                branches={branches}
            />
        </div>
    );
}

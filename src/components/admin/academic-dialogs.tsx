"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createBranch, createSubject } from "@/actions/academic-actions";

interface BranchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateBranchDialog({ open, onOpenChange, onSuccess }: BranchDialogProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        course_type: "UG" as "UG" | "PG" | "BOTH",
        description: "",
        duration_semesters: 8
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createBranch(formData);
            if (result.success) {
                toast({ title: "Success", description: "Department created successfully" });
                onSuccess();
                onOpenChange(false);
                setFormData({ name: "", code: "", course_type: "UG", description: "", duration_semesters: 8 });
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to create department", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Department (Branch)</DialogTitle>
                    <DialogDescription>Create a new academic branch.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Branch Name</Label>
                        <Input
                            required
                            placeholder="e.g. Computer Science Engineering"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Code</Label>
                            <Input
                                required
                                placeholder="e.g. CSE"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={formData.course_type}
                                onValueChange={(v) => setFormData({ ...formData, course_type: v as any })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UG">Undergraduate (UG)</SelectItem>
                                    <SelectItem value="PG">Postgraduate (PG)</SelectItem>
                                    <SelectItem value="BOTH">Both</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Duration (Semesters)</Label>
                        <Input
                            type="number"
                            min={1}
                            max={10}
                            required
                            value={formData.duration_semesters}
                            onChange={(e) => setFormData({ ...formData, duration_semesters: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Optional description..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="gold" disabled={loading}>
                            {loading ? "Creating..." : "Create Branch"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface SubjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    branches: Array<{ id: string; name: string }>;
}

export function CreateSubjectDialog({ open, onOpenChange, onSuccess, branches }: SubjectDialogProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        branch_id: "",
        semester: 1,
        credits: 3,
        type: "THEORY" as "THEORY" | "LAB" | "ELECTIVE"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createSubject(formData);
            if (result.success) {
                toast({ title: "Success", description: "Subject created successfully" });
                onSuccess();
                onOpenChange(false);
                setFormData({ name: "", code: "", branch_id: "", semester: 1, credits: 3, type: "THEORY" });
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to create subject", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Subject</DialogTitle>
                    <DialogDescription>Add a new subject to the curriculum.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Subject Name</Label>
                        <Input
                            required
                            placeholder="e.g. Data Structures"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Subject Code</Label>
                            <Input
                                required
                                placeholder="e.g. CS101"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(v) => setFormData({ ...formData, type: v as any })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="THEORY">Theory</SelectItem>
                                    <SelectItem value="LAB">Lab / Practical</SelectItem>
                                    <SelectItem value="ELECTIVE">Elective</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Department (Branch)</Label>
                        <Select
                            value={formData.branch_id}
                            onValueChange={(v) => setFormData({ ...formData, branch_id: v })}
                            required
                        >
                            <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                            <SelectContent>
                                {branches.map(b => (
                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Semester</Label>
                            <Input
                                type="number"
                                min={1}
                                max={8}
                                required
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Credits</Label>
                            <Input
                                type="number"
                                min={1}
                                max={5}
                                required
                                value={formData.credits}
                                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="gold" disabled={loading}>
                            {loading ? "Creating..." : "Add Subject"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

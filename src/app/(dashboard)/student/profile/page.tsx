"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Hash, BookOpen, Save } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/actions/auth-actions";
import { toast } from "@/hooks/use-toast"; // Assuming this hook exists

export default function StudentProfilePage() {
    const { user } = useAuthStore(); // This might only have basic user info
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;

            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("user_id", user.id)
                .single();

            const { data: studentData } = await supabase
                .from("students")
                .select(`
            *,
            branch:branches(name),
            institution:institutions(name)
        `)
                .eq("user_id", user.id)
                .single();

            if (profileData) {
                setProfile({ ...profileData, student: studentData });
            }
            setLoading(false);
        }
        fetchProfile();
    }, [user, supabase]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateProfile(formData);

        if (result.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
            // Refresh local state
            setProfile((prev: any) => ({
                ...prev,
                full_name: formData.get("fullName"),
                phone: formData.get("phone"),
                bio: formData.get("bio")
            }));
        }
        setSaving(false);
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8 space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />)}
        </div>;
    }

    if (!profile) return <div>Profile not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">Manage your personal information</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: ID Card style */}
                <Card className="glass-card md:col-span-1">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <Avatar className="h-32 w-32 border-4 border-gold-500/20 mb-4">
                            <AvatarImage src={profile.avatar_url} />
                            <AvatarFallback className="text-4xl bg-gold-500/10 text-gold-500">
                                {profile.full_name?.charAt(0) || "S"}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-bold mb-1">{profile.full_name}</h2>
                        <Badge variant="outline" className="mb-4">Student</Badge>

                        <div className="w-full space-y-3 text-left">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                <Hash className="h-4 w-4" />
                                <div>
                                    <p className="text-xs font-semibold">PIN Number</p>
                                    <p className="font-mono text-foreground">{profile.pin_number || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                <BookOpen className="h-4 w-4" />
                                <div>
                                    <p className="text-xs font-semibold">Department</p>
                                    <p className="text-foreground">{profile.student?.branch?.name || "Unassigned"}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Details & Edit Form */}
                <Card className="glass-card md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Personal Details</CardTitle>
                            <CardDescription>Update your contact information</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            defaultValue={profile.full_name}
                                            disabled={!isEditing}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            value={user?.email || ""}
                                            disabled
                                            className="pl-9 bg-muted"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            defaultValue={profile.phone || ""}
                                            placeholder="+91 98765 43210"
                                            disabled={!isEditing}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio / About</Label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    defaultValue={profile.bio || ""}
                                    placeholder="Tell us a bit about yourself..."
                                    disabled={!isEditing}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            {isEditing && (
                                <div className="flex justify-end pt-4">
                                    <Button type="submit" className="gold" disabled={saving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {saving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

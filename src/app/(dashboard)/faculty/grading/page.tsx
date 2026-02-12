"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePendingGrading } from "@/hooks/use-dashboard";
import { FileText, CheckCircle, Clock, User } from "lucide-react";

export default function GradingPage() {
  const { pendingCount, loading } = usePendingGrading();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Grading</h1>
        <p className="text-muted-foreground">Review and grade student submissions</p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  {loading ? (
                    <div className="h-9 w-24 bg-muted animate-pulse rounded" />
                  ) : (
                    <p className="text-3xl font-bold">{pendingCount}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-yellow-500/10">
                  <Clock className="h-3 w-3 mr-1" />
                  Due Soon
                </Badge>
                <Badge variant="outline" className="bg-green-500/10">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Graded Today: 0
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>Student work awaiting your review</CardDescription>
          </div>
          <Input
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Submission list will appear here</p>
            <p className="text-sm">Feature integration in progress</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

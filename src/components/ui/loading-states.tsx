import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="flex h-screen w-full bg-muted/40">
            {/* Sidebar Skeleton */}
            <div className="hidden border-r bg-background md:block w-64">
                <div className="flex h-14 items-center border-b px-4">
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="space-y-4 py-4 px-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex flex-col flex-1">
                <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="w-full flex-1">
                        <Skeleton className="h-8 w-48" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-xl" />
                        ))}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Skeleton className="col-span-4 h-[400px] rounded-xl" />
                        <Skeleton className="col-span-3 h-[400px] rounded-xl" />
                    </div>
                </main>
            </div>
        </div>
    );
}

export function TableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-8 w-[100px]" />
            </div>
            <div className="rounded-md border">
                <div className="h-12 border-b px-4 flex items-center">
                    <Skeleton className="h-4 w-full" />
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 border-b px-4 flex items-center">
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

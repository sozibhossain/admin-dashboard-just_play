import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-6 border-slate-700 bg-slate-900">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Skeleton className="h-4 w-32 bg-slate-800 mb-4" />
              <Skeleton className="h-8 w-40 bg-slate-800 mb-2" />
              <Skeleton className="h-3 w-24 bg-slate-700" />
            </div>
            <Skeleton className="h-10 w-10 rounded bg-slate-800" />
          </div>
        </Card>
      ))}
    </div>
  );
}

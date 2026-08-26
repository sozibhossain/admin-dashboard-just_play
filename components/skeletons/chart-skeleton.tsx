import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const BAR_HEIGHTS = [72, 110, 58, 132, 84, 100, 66];

export function ChartSkeleton() {
  return (
    <Card className="p-6 border-slate-700 bg-slate-900">
      <Skeleton className="h-5 w-40 bg-slate-800 mb-6" />
      <div className="flex items-end justify-around h-64 gap-2">
        {BAR_HEIGHTS.map((height, i) => (
          <Skeleton
            key={i}
            className="flex-1 bg-slate-800 rounded"
            style={{
              height: `${height}px`,
            }}
          />
        ))}
      </div>
    </Card>
  );
}

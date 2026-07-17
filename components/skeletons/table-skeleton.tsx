import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export function TableSkeleton({ columns, rows = 10 }: TableSkeletonProps) {
  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-900 border-slate-700">
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i} className="p-4">
                <Skeleton className="h-4 bg-slate-700" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-slate-700">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex} className="p-4">
                  <Skeleton className="h-4 bg-slate-800" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

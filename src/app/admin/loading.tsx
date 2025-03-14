import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-md" />
        ))}
      </div>

      <Skeleton className="h-[400px] rounded-md" />
    </div>
  )
}


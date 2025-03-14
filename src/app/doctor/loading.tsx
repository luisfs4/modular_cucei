import { Skeleton } from "@/components/ui/skeleton"

export default function DoctorLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-md" />
        ))}
      </div>
    </div>
  )
}


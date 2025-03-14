import { Skeleton } from "@/components/ui/skeleton"

export default function PacienteLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[150px] rounded-md" />
        ))}
      </div>
    </div>
  )
}


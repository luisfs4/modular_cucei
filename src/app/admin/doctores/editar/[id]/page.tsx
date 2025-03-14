import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import FormularioEditarDoctor from "./formulario-editar-doctor"

export default function EditarDoctor({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/doctores">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Editar Doctor</h1>
      </div>

      <FormularioEditarDoctor id={params.id} />
    </div>
  )
}


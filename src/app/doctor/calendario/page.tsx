export const dynamic = "force-dynamic"

import CalendarioDoctor from "./calendario-doctor"

export default function PaginaCalendario() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendario de Citas</h1>
        <p className="text-muted-foreground">Gestiona tus citas y horarios de atención.</p>
      </div>

      <CalendarioDoctor />
    </div>
  )
}


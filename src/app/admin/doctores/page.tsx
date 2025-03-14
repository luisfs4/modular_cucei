import AdminTablaDoctores from "./admin-tabla-doctores"

export default function PaginaDoctores() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Doctores</h1>
        <p className="text-muted-foreground">Administra los doctores registrados en la clínica.</p>
      </div>

      <AdminTablaDoctores />
    </div>
  )
}


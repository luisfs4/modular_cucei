import ExpedienteCitas from "./expediente-citas"

export default function PaginaExpediente() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Expediente</h1>
        <p className="text-muted-foreground">Consulta tu historial de citas y resultados médicos.</p>
      </div>

      <ExpedienteCitas />
    </div>
  )
}


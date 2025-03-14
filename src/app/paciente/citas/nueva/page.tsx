import FormularioNuevaCita from "./formulario-nueva-cita"

export default function PaginaNuevaCita() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agendar Nueva Cita</h1>
        <p className="text-muted-foreground">Programa una cita con uno de nuestros especialistas.</p>
      </div>

      <FormularioNuevaCita />
    </div>
  )
}


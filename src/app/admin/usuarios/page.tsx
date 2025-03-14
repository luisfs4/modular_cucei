import AdminTablaUsuarios from "./admin-tabla-usuarios"

export default function PaginaUsuarios() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">Administra los usuarios registrados en la clínica.</p>
      </div>

      <AdminTablaUsuarios />
    </div>
  )
}


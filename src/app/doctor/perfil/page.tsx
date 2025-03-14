import PerfilDoctor from "./perfil-doctor"

export default function PaginaPerfil() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">Visualiza y actualiza tu información personal y profesional.</p>
      </div>

      <PerfilDoctor />
    </div>
  )
}


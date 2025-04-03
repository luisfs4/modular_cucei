import Image from "next/image"
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface InformacionPacienteProps {
  paciente: any
}

export default function InformacionPaciente({ paciente }: InformacionPacienteProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
        <CardDescription>Datos personales y de contacto del paciente.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-40 h-40">
              <Image
                src={paciente.imagen || "/placeholder.svg?height=200&width=200"}
                alt={paciente.nombre}
                width={160}
                height={160}
                className="rounded-full object-cover border-4 border-background"
              />
            </div>
            <div className="text-center">
              <p className="font-medium text-lg">{paciente.nombre}</p>
              <p className="text-sm text-muted-foreground">
                {paciente.edad ? `${paciente.edad} años` : "Edad no disponible"}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Género</p>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{paciente.genero || "No especificado"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Correo electrónico</p>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{paciente.email || "No disponible"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{paciente.tel || "No disponible"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{paciente.direccion || "No disponible"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Historial de visitas</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Última visita: {paciente.ultima_visita || "No hay visitas registradas"}</span>
              </div>
              <div className="flex items-center ml-6">
                <span>Próxima cita: {paciente.proxima_cita || "No hay citas programadas"}</span>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4 mt-4">
              <p className="text-sm font-medium">Información adicional</p>
              <p className="text-sm text-muted-foreground">
                El paciente se encuentra actualmente en estado {paciente.estado.toLowerCase()}.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


import Link from "next/link"
import { ChevronLeft, Calendar, Clock, MapPin, User, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para la cita
const citaMock = {
  id: 4,
  doctor: "Dra. Ana Martínez",
  especialidad: "Dermatología",
  fecha: "05/11/2023",
  hora: "16:00 PM",
  ubicacion: "Consultorio 302",
  estado: "Programada",
  notas: "",
  duracion: 30,
}

export default function DetalleCita({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/paciente/expediente">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Detalle de Cita</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{citaMock.doctor}</CardTitle>
              <CardDescription>{citaMock.especialidad}</CardDescription>
            </div>
            <Badge variant="default">{citaMock.estado}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{citaMock.fecha}</p>
                <p className="text-sm text-muted-foreground">Fecha</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {citaMock.hora} ({citaMock.duracion} min)
                </p>
                <p className="text-sm text-muted-foreground">Hora y duración</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{citaMock.ubicacion}</p>
                <p className="text-sm text-muted-foreground">Ubicación</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <p className="font-medium">Información del Doctor</p>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              La Dra. Ana Martínez es especialista en Dermatología con más de 10 años de experiencia. Especializada en
              tratamientos para problemas de la piel y procedimientos estéticos.
            </p>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <p className="font-medium">Preparación para la cita</p>
            </div>
            <ul className="text-sm text-muted-foreground pl-7 space-y-1 list-disc ml-4">
              <li>Llegar 15 minutos antes de la hora programada</li>
              <li>Traer identificación y tarjeta de seguro médico</li>
              <li>Si es primera consulta, traer historial médico previo</li>
              <li>No aplicar cremas ni maquillaje en el área a examinar</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/paciente/expediente">Volver</Link>
          </Button>
          <Button variant="destructive">Cancelar Cita</Button>
        </CardFooter>
      </Card>
    </div>
  )
}


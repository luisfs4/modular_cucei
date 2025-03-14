import { Search, UserPlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para pacientes
const pacientesMock = [
  {
    id: 1,
    nombre: "Ana López",
    edad: 35,
    ultimaCita: "15/08/2023",
    proximaCita: "20/11/2023",
    estado: "Activo",
    imagen: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    nombre: "Pedro Ramírez",
    edad: 42,
    ultimaCita: "22/09/2023",
    proximaCita: "15/12/2023",
    estado: "Activo",
    imagen: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    nombre: "Sofía Torres",
    edad: 28,
    ultimaCita: "10/10/2023",
    proximaCita: null,
    estado: "Inactivo",
    imagen: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    nombre: "Miguel Hernández",
    edad: 50,
    ultimaCita: "05/11/2023",
    proximaCita: "10/01/2024",
    estado: "Activo",
    imagen: "/placeholder.svg?height=40&width=40",
  },
]

export default function PaginaPacientes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Pacientes</h1>
        <p className="text-muted-foreground">Gestiona la información de tus pacientes y su historial médico.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar pacientes..." className="pl-8" />
        </div>
        <Button asChild>
          <Link href="/doctor/pacientes/nuevo">
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Paciente
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pacientesMock.map((paciente) => (
          <Card key={paciente.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="bg-muted px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={paciente.imagen || "/placeholder.svg"}
                    alt={paciente.nombre}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <CardTitle className="text-base">{paciente.nombre}</CardTitle>
                    <CardDescription>{paciente.edad} años</CardDescription>
                  </div>
                </div>
                <Badge variant={paciente.estado === "Activo" ? "default" : "secondary"}>{paciente.estado}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Última cita:</span>
                  <span className="text-sm font-medium">{paciente.ultimaCita}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Próxima cita:</span>
                  <span className="text-sm font-medium">{paciente.proximaCita || "No programada"}</span>
                </div>
                <div className="pt-2 flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/doctor/pacientes/${paciente.id}`}>Ver Historial</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


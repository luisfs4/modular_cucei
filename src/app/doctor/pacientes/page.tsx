"use client"

import { useState, useEffect } from "react"
import { Search, UserPlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { doctoresService, type DoctorPaciente } from "@/services/doctores-service"
import { PacientesLoadingSkeleton } from "./loading-skeleton"

export default function PaginaPacientes() {
  const { user } = useAuth()
  const [pacientes, setPacientes] = useState<DoctorPaciente[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarPacientes = async () => {
      if (user?.access_token) {
        try {
          const data = await doctoresService.getPacientes(user.id, user.access_token)
          setPacientes(data)
        } catch (error) {
          console.error("Error al cargar pacientes:", error)
          toast({
            title: "Error",
            description: "No se pudieron cargar los pacientes.",
            variant: "destructive",
          })
        } finally {
          setCargando(false)
        }
      }
    }

    cargarPacientes()
  }, [user])

  // Filtrar pacientes por búsqueda
  const pacientesFiltrados = pacientes.filter(
    (paciente) =>
      paciente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (paciente.email && paciente.email.toLowerCase().includes(busqueda.toLowerCase())) ||
      (paciente.tel && paciente.tel.includes(busqueda)),
  )

  if (cargando) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Pacientes</h1>
          <p className="text-muted-foreground">Gestiona la información de tus pacientes y su historial médico.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-10 w-40" />
        </div>

        <PacientesLoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Pacientes</h1>
        <p className="text-muted-foreground">Gestiona la información de tus pacientes y su historial médico.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar pacientes..."
            className="pl-8"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link href="/doctor/pacientes/nuevo">
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Paciente
          </Link>
        </Button>
      </div>

      {pacientesFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pacientesFiltrados.map((paciente) => (
            <Card key={paciente.id_paciente} className="overflow-hidden">
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
                      <CardDescription>
                        {paciente.edad ? `${paciente.edad} años` : "Edad no disponible"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={paciente.estado === "Activo" ? "default" : "secondary"}>{paciente.estado}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Última cita:</span>
                    <span className="text-sm font-medium">{paciente.ultima_visita || "No disponible"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Próxima cita:</span>
                    <span className="text-sm font-medium">{paciente.proxima_cita || "No programada"}</span>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/doctor/pacientes/${paciente.id_paciente}`}>Ver Historial</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No se encontraron pacientes que coincidan con la búsqueda.</p>
          {busqueda && (
            <Button variant="link" onClick={() => setBusqueda("")}>
              Limpiar búsqueda
            </Button>
          )}
        </div>
      )}
    </div>
  )
}


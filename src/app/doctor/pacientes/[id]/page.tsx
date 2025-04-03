"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"

import InformacionPaciente from "./informacion-paciente"
import HistorialCitas from "./historial-citas"
import NotasMedicas from "./notas-medicas"
import { doctoresService } from "@/services/doctores-service"
import { citasService } from "@/services/citas-service"

export default function DetallePaciente({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [paciente, setPaciente] = useState<any>(null)
  const [citas, setCitas] = useState<any[]>([]) // Inicializar como array vacío
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      if (user?.access_token) {
        try {
          // Cargar datos del paciente
          const pacienteId = Number.parseInt(params.id)
          const pacientes = await doctoresService.getPacientes(user.id, user.access_token)
          const pacienteEncontrado = pacientes.find((p) => p.id_paciente === pacienteId)

          if (!pacienteEncontrado) {
            toast({
              title: "Error",
              description: "No se encontró el paciente solicitado.",
              variant: "destructive",
            })
            router.push("/doctor/pacientes")
            return
          }

          setPaciente(pacienteEncontrado)

          try {
            // Cargar historial de citas del paciente con este doctor
            const todasLasCitas = await citasService.getByDoctor(user.id, user.access_token)
            // Asegurarnos de que todasLasCitas no sea undefined antes de filtrar
            if (Array.isArray(todasLasCitas)) {
              const citasPaciente = todasLasCitas.filter(
                (c) => c.doctor.includes(pacienteEncontrado.nombre) || c.notas?.includes(pacienteEncontrado.nombre),
              )
              setCitas(citasPaciente)
            } else {
              setCitas([])
            }
          } catch (error) {
            console.error("Error al cargar citas:", error)
            setCitas([]) // Establecer un array vacío en caso de error
          }
        } catch (error) {
          console.error("Error al cargar datos:", error)
          toast({
            title: "Error",
            description: "No se pudieron cargar los datos del paciente.",
            variant: "destructive",
          })
        } finally {
          setCargando(false)
        }
      }
    }

    cargarDatos()
  }, [params.id, user, router])

  if (cargando) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (!paciente) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/doctor/pacientes")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Paciente no encontrado</h1>
        </div>
        <p>No se pudo encontrar la información del paciente solicitado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/doctor/pacientes")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Historial de {paciente.nombre}</h1>
      </div>

      <Tabs defaultValue="informacion" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="informacion">Información Personal</TabsTrigger>
          <TabsTrigger value="historial">Historial de Citas</TabsTrigger>
          <TabsTrigger value="notas">Notas Médicas</TabsTrigger>
        </TabsList>
        <TabsContent value="informacion">
          <InformacionPaciente paciente={paciente} />
        </TabsContent>
        <TabsContent value="historial">
          <HistorialCitas citas={citas} />
        </TabsContent>
        <TabsContent value="notas">
          <NotasMedicas pacienteId={paciente.id_paciente} />
        </TabsContent>
      </Tabs>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Calendar, Clock, MapPin, User, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { citasService, type Cita } from "@/services"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function DetalleCita({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [cita, setCita] = useState<Cita | null>(null)
  const [cargando, setCargando] = useState(true)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [cancelando, setCancelando] = useState(false)

  useEffect(() => {
    const cargarCita = async () => {
      if (user?.access_token) {
        try {
          const data = await citasService.getById(Number.parseInt(params.id), user.access_token)
          setCita(data)
        } catch (error) {
          console.error("Error al cargar cita:", error)
          toast({
            title: "Error",
            description: "No se pudo cargar la información de la cita.",
            variant: "destructive",
          })
        } finally {
          setCargando(false)
        }
      }
    }

    cargarCita()
  }, [params.id, user])

  const cancelarCita = async () => {
    if (!user?.access_token || !cita) return

    setCancelando(true)
    try {
      await citasService.update(
        cita.id,
        {
          estado: "cancelada",
        },
        user.access_token,
      )

      toast({
        title: "Cita cancelada",
        description: "La cita ha sido cancelada exitosamente.",
      })

      // Actualizar el estado de la cita en el componente
      setCita({
        ...cita,
        estado: "cancelada",
      })

      setDialogoAbierto(false)
    } catch (error) {
      console.error("Error al cancelar cita:", error)
      toast({
        title: "Error",
        description: "No se pudo cancelar la cita. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setCancelando(false)
    }
  }

  if (cargando) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-[400px] w-full max-w-2xl mx-auto" />
      </div>
    )
  }

  if (!cita) {
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
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No se encontró la información de la cita.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Función para obtener el color de la badge según el estado
  const getColorBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "completada":
        return "success"
      case "programada":
        return "default"
      case "cancelada":
        return "destructive"
      default:
        return "secondary"
    }
  }

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
              <CardTitle className="text-2xl">{cita.doctor}</CardTitle>
              <CardDescription>{cita.especialidad}</CardDescription>
            </div>
            <Badge variant={getColorBadge(cita.estado) as any}>{cita.estado}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{cita.fecha}</p>
                <p className="text-sm text-muted-foreground">Fecha</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{cita.hora}</p>
                <p className="text-sm text-muted-foreground">Hora</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{cita.ubicacion || "Consultorio Principal"}</p>
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
              {cita.doctor} es especialista en {cita.especialidad}.
            </p>
          </div>

          {cita.notas && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">Notas</p>
              </div>
              <p className="text-sm text-muted-foreground pl-7">{cita.notas}</p>
            </div>
          )}

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
          {cita.estado.toLowerCase() === "programada" && (
            <Button variant="destructive" onClick={() => setDialogoAbierto(true)}>
              Cancelar Cita
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Diálogo de confirmación para cancelar */}
      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cancelación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoAbierto(false)} disabled={cancelando}>
              Volver
            </Button>
            <Button variant="destructive" onClick={cancelarCita} disabled={cancelando}>
              {cancelando ? "Cancelando..." : "Confirmar cancelación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


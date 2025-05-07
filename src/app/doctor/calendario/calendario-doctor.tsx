"use client"

import { useState, useEffect } from "react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { citasService, type Cita } from "@/services"

export default function CalendarioDoctor() {
  const { user } = useAuth()
  const [semanaActual, setSemanaActual] = useState<Date>(new Date())
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(new Date())
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [citas, setCitas] = useState<Cita[]>([])
  const [cargando, setCargando] = useState(true)

  // Cargar citas al montar el componente
  useEffect(() => {
    const cargarCitas = async () => {
      if (user?.access_token) {
        try {
          const data = await citasService.getByDoctor(user.id, user.access_token)
          setCitas(data)
        } catch (error) {
          console.error("Error al cargar citas:", error)
          toast({
            title: "Error",
            description: "No se pudieron cargar tus citas.",
            variant: "destructive",
          })
        } finally {
          setCargando(false)
        }
      }
    }

    cargarCitas()
  }, [user])

  // Calcular el inicio y fin de la semana
  const inicioSemana = startOfWeek(semanaActual, { weekStartsOn: 1 })
  const finSemana = endOfWeek(semanaActual, { weekStartsOn: 1 })

  // Obtener los días de la semana
  const diasSemana = eachDayOfInterval({
    start: inicioSemana,
    end: finSemana,
  }).filter((dia) => dia.getDay() !== 0 && dia.getDay() !== 6) // Excluir sábado y domingo

  // Función para cambiar a la semana anterior
  const semanaAnterior = () => {
    setSemanaActual((fecha) => addDays(fecha, -7))
  }

  // Función para cambiar a la semana siguiente
  const semanaSiguiente = () => {
    setSemanaActual((fecha) => addDays(fecha, 7))
  }

  // Función para obtener las citas de un día específico
  const getCitasDia = (dia: Date) => {
    return citas.filter((cita) => {
      try {
        // Convertir la fecha de string a Date
        const fechaCita = parseISO(cita.fecha)
        return isSameDay(fechaCita, dia)
      } catch (error) {
        return false
      }
    })
  }

  // Función para mostrar detalles de una cita
  const verDetalleCita = (cita: Cita) => {
    setCitaSeleccionada(cita)
    setDialogoAbierto(true)
  }

  // Función para formatear la hora
  const formatearHora = (hora: string) => {
    return hora
  }

  // Función para obtener el color de fondo según el estado de la cita
  const getColorEstado = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "programada":
        return "bg-blue-50 hover:bg-blue-100"
      case "completada":
        return "bg-green-50 hover:bg-green-100"
      case "cancelada":
        return "bg-red-50 hover:bg-red-100"
      default:
        return "bg-primary/10 hover:bg-primary/20"
    }
  }

  // Función para obtener la variante del badge según el estado
  const getVarianteBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "programada":
        return "secondary"
      case "completada":
        return "success"
      case "cancelada":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (cargando) {
    return (
      <div className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-bold">Buscar semana</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fechaSeleccionada}
                onSelect={(date) => {
                  setFechaSeleccionada(date)
                  if (date) {
                    setSemanaActual(date)
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={semanaAnterior}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {format(inicioSemana, "d 'de' MMMM", { locale: es })} -{" "}
            {format(finSemana, "d 'de' MMMM, yyyy", { locale: es })}
          </div>
          <Button variant="outline" size="icon" onClick={semanaSiguiente}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {diasSemana.map((dia) => {
          const citasDelDia = getCitasDia(dia)
          return (
            <Card key={dia.toString()} className={`${isSameDay(dia, new Date()) ? "border-primary" : ""}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-center">{format(dia, "EEEE", { locale: es })}</CardTitle>
                <CardDescription className="text-center">{format(dia, "d 'de' MMMM", { locale: es })}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {citasDelDia.length > 0 ? (
                    citasDelDia.map((cita) => (
                      <div
                        key={cita.id}
                        className={`p-2 rounded-md cursor-pointer transition-colors ${getColorEstado(cita.estado)}`}
                        onClick={() => verDetalleCita(cita)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-xs">{formatearHora(cita.hora)}</span>
                          </div>
                          <Badge variant={getVarianteBadge(cita.estado)} className="text-xs capitalize text-white">
                            {cita.estado}
                          </Badge>
                        </div>
                        <div className="mt-1 font-medium text-sm truncate">
                          {cita.paciente || "Paciente sin nombre"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-sm text-muted-foreground">No hay citas programadas</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Diálogo para mostrar detalles de la cita */}
      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles de la Cita</DialogTitle>
            <DialogDescription>Información completa de la cita seleccionada.</DialogDescription>
          </DialogHeader>
          {citaSeleccionada && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{citaSeleccionada.paciente || "Paciente sin nombre"}</p>
                  <p className="text-sm text-muted-foreground">Paciente</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{citaSeleccionada.hora}</p>
                  <p className="text-sm text-muted-foreground">Hora</p>
                </div>
                <div>
                  <p className="font-medium">30 minutos</p>
                  <p className="text-sm text-muted-foreground">Duración</p>
                </div>
              </div>
              <div>
                <p className="font-medium">{citaSeleccionada.fecha}</p>
                <p className="text-sm text-muted-foreground">Fecha</p>
              </div>
              <div>
                <Badge variant={getVarianteBadge(citaSeleccionada.estado)}>{citaSeleccionada.estado}</Badge>
                <p className="text-sm text-muted-foreground mt-1">Estado</p>
              </div>
              {citaSeleccionada.notas && (
                <div>
                  <p className="font-medium">{citaSeleccionada.notas}</p>
                  <p className="text-sm text-muted-foreground">Notas</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={() => setDialogoAbierto(false)}>Cerrar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

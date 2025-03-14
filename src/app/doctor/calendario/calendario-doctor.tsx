"use client"

import { useState } from "react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Datos de ejemplo para citas
const citasMock = [
  {
    id: 1,
    paciente: "Ana López",
    fecha: new Date(2023, 10, 15, 10, 0),
    duracion: 30,
    motivo: "Revisión de rutina",
    estado: "Programada",
  },
  {
    id: 2,
    paciente: "Pedro Ramírez",
    fecha: new Date(2023, 10, 15, 11, 30),
    duracion: 30,
    motivo: "Dolor de cabeza recurrente",
    estado: "Programada",
  },
  {
    id: 3,
    paciente: "Sofía Torres",
    fecha: new Date(2023, 10, 16, 9, 15),
    duracion: 45,
    motivo: "Seguimiento de tratamiento",
    estado: "Programada",
  },
  {
    id: 4,
    paciente: "Miguel Hernández",
    fecha: new Date(2023, 10, 16, 14, 0),
    duracion: 30,
    motivo: "Primera consulta",
    estado: "Programada",
  },
  {
    id: 5,
    paciente: "Laura Díaz",
    fecha: new Date(2023, 10, 17, 12, 45),
    duracion: 30,
    motivo: "Resultados de exámenes",
    estado: "Programada",
  },
]

export default function CalendarioDoctor() {
  const [semanaActual, setSemanaActual] = useState<Date>(new Date())
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(new Date())
  const [citaSeleccionada, setCitaSeleccionada] = useState<any | null>(null)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)

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
    return citasMock.filter((cita) => isSameDay(cita.fecha, dia))
  }

  // Función para mostrar detalles de una cita
  const verDetalleCita = (cita: any) => {
    setCitaSeleccionada(cita)
    setDialogoAbierto(true)
  }

  // Función para formatear la hora
  const formatearHora = (fecha: Date) => {
    return format(fecha, "h:mm a", { locale: es })
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Calendario de Citas</h2>
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
        {diasSemana.map((dia) => (
          <Card key={dia.toString()} className={`${isSameDay(dia, new Date()) ? "border-primary" : ""}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-center">{format(dia, "EEEE", { locale: es })}</CardTitle>
              <CardDescription className="text-center">{format(dia, "d 'de' MMMM", { locale: es })}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getCitasDia(dia).length > 0 ? (
                  getCitasDia(dia).map((cita) => (
                    <div
                      key={cita.id}
                      className="p-2 rounded-md bg-primary/10 hover:bg-primary/20 cursor-pointer transition-colors"
                      onClick={() => verDetalleCita(cita)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-xs">{formatearHora(cita.fecha)}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {cita.duracion} min
                        </Badge>
                      </div>
                      <div className="mt-1 font-medium text-sm truncate">{cita.paciente}</div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">No hay citas programadas</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
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
                  <p className="font-medium">{citaSeleccionada.paciente}</p>
                  <p className="text-sm text-muted-foreground">Paciente</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{formatearHora(citaSeleccionada.fecha)}</p>
                  <p className="text-sm text-muted-foreground">Hora</p>
                </div>
                <div>
                  <p className="font-medium">{citaSeleccionada.duracion} minutos</p>
                  <p className="text-sm text-muted-foreground">Duración</p>
                </div>
              </div>
              <div>
                <p className="font-medium">
                  {format(citaSeleccionada.fecha, "EEEE d 'de' MMMM, yyyy", { locale: es })}
                </p>
                <p className="text-sm text-muted-foreground">Fecha</p>
              </div>
              <div>
                <p className="font-medium">{citaSeleccionada.motivo}</p>
                <p className="text-sm text-muted-foreground">Motivo de la consulta</p>
              </div>
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


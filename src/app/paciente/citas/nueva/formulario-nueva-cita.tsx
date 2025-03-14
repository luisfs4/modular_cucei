"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

// Datos de ejemplo para doctores y horarios
const doctoresMock = [
  { id: 1, nombre: "Dr. Juan Pérez", especialidad: "Cardiología" },
  { id: 2, nombre: "Dra. María González", especialidad: "Neurología" },
  { id: 3, nombre: "Dr. Carlos Rodríguez", especialidad: "Pediatría" },
  { id: 4, nombre: "Dra. Ana Martínez", especialidad: "Dermatología" },
  { id: 5, nombre: "Dr. Roberto Sánchez", especialidad: "Oftalmología" },
]

const horariosMock = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
]

export default function FormularioNuevaCita() {
  const router = useRouter()
  const [fecha, setFecha] = useState<Date | undefined>(undefined)
  const [doctor, setDoctor] = useState<string>("")
  const [horario, setHorario] = useState<string>("")
  const [motivo, setMotivo] = useState<string>("")
  const [enviando, setEnviando] = useState(false)

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fecha || !doctor || !horario) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }

    setEnviando(true)

    // Simulamos una petición a la API
    try {
      // En un caso real, aquí enviaríamos los datos a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Cita agendada",
        description: "Tu cita ha sido agendada exitosamente.",
      })

      // Redirigir al expediente de citas
      router.push("/paciente/expediente")
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al agendar la cita. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Agendar Nueva Cita</CardTitle>
        <CardDescription>
          Completa el formulario para agendar una cita con uno de nuestros especialistas.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select value={doctor} onValueChange={setDoctor} required>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un doctor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {doctoresMock.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id.toString()}>
                      {doc.nombre} - {doc.especialidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Selecciona el especialista con el que deseas agendar tu cita.</FormDescription>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!fecha ? "text-muted-foreground" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fecha ? format(fecha, "PPP", { locale: es }) : "Selecciona una fecha"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fecha}
                    onSelect={setFecha}
                    initialFocus
                    disabled={
                      (date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0)) || // Deshabilitar fechas pasadas
                        date.getDay() === 0 ||
                        date.getDay() === 6 // Deshabilitar fines de semana
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Selecciona la fecha para tu cita. No se pueden agendar citas en fines de semana.
              </FormDescription>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Horario</FormLabel>
              <Select value={horario} onValueChange={setHorario} required disabled={!fecha}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un horario" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {horariosMock.map((hora) => (
                    <SelectItem key={hora} value={hora}>
                      {hora}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Selecciona el horario que prefieras para tu cita.</FormDescription>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Motivo de la consulta</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe brevemente el motivo de tu consulta"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
              </FormControl>
              <FormDescription>Esta información ayudará al doctor a prepararse para tu consulta.</FormDescription>
              <FormMessage />
            </FormItem>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={enviando}>
            {enviando ? "Agendando..." : "Agendar Cita"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}


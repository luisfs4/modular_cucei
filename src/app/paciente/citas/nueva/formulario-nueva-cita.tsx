"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { useAuth } from "@/hooks/use-auth"
import { doctoresService, citasService, type OptionDoctor } from "@/services"

export default function FormularioNuevaCita() {
  const router = useRouter()
  const { user } = useAuth()
  const [fecha, setFecha] = useState<Date | undefined>(undefined)
  const [doctor, setDoctor] = useState<string>("")
  const [horario, setHorario] = useState<string>("")
  const [motivo, setMotivo] = useState<string>("")
  const [enviando, setEnviando] = useState(false)
  const [doctores, setDoctores] = useState<OptionDoctor[]>([])
  const [cargandoDoctores, setCargandoDoctores] = useState(true)

  // Horarios disponibles
  const horariosMock = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]

  // Cargar doctores al montar el componente
  useEffect(() => {
    const cargarDoctores = async () => {
      if (user?.access_token) {
        try {
          const data = await doctoresService.getEspecialidades(user.access_token)
          setDoctores(data)
        } catch (error) {
          console.error("Error al cargar doctores:", error)
          toast({
            title: "Error",
            description: "No se pudieron cargar los doctores disponibles.",
            variant: "destructive",
          })
        } finally {
          setCargandoDoctores(false)
        }
      }
    }

    cargarDoctores()
  }, [user])

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

    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para agendar una cita.",
        variant: "destructive",
      })
      return
    }

    setEnviando(true)

    try {
      // Formatear la fecha para la API
      const fechaFormateada = format(fecha, "yyyy-MM-dd")

      // Crear objeto de cita
      const nuevaCita = {
        id_paciente: user.id,
        id_medico: Number.parseInt(doctor),
        fecha: fechaFormateada,
        hora: horario,
        motivo: motivo || undefined,
        duracion: 30, // Duración por defecto en minutos
        ubicacion: "Consultorio Principal", // Ubicación por defecto
      }

      // Enviar a la API
      await citasService.create(nuevaCita, user.access_token)

      toast({
        title: "Cita agendada",
        description: "Tu cita ha sido agendada exitosamente.",
      })

      // Redirigir al expediente de citas
      router.push("/paciente/expediente")
    } catch (error) {
      console.error("Error al agendar cita:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al agendar la cita. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setEnviando(false)
    }
  }

  // Encontrar el nombre del doctor seleccionado
  const doctorSeleccionado = doctores.find((d) => d.id.toString() === doctor)

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
              <Select value={doctor} onValueChange={setDoctor} disabled={cargandoDoctores} required>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={cargandoDoctores ? "Cargando doctores..." : "Selecciona un doctor"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {doctores.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id.toString()}>
                      {doc.nombre} {doc.especialidad ? `- ${doc.especialidad}` : ""}
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


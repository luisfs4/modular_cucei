"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

// Datos de ejemplo para el doctor
const doctorMock = {
  id: 1,
  nombre: "Dr. Juan Pérez",
  especialidad: "Cardiología",
  email: "juan.perez@clinica.com",
  telefono: "555-123-4567",
  direccion: "Av. Principal 123, Ciudad",
  biografia:
    "Cardiólogo con más de 15 años de experiencia. Especializado en cardiología intervencionista y enfermedades cardiovasculares.",
  horario: "Lunes a Viernes: 9:00 AM - 6:00 PM",
  estado: "Activo",
}

export default function FormularioEditarDoctor({ id }: { id: string }) {
  const router = useRouter()
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    especialidad: "",
    email: "",
    telefono: "",
    direccion: "",
    biografia: "",
    horario: "",
    estado: "",
  })

  useEffect(() => {
    // Simulamos la carga de datos del doctor
    const cargarDoctor = async () => {
      try {
        // En un caso real, aquí haríamos una petición a la API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Usamos datos de ejemplo
        setFormData(doctorMock)
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar la información del doctor.",
          variant: "destructive",
        })
      } finally {
        setCargando(false)
      }
    }

    cargarDoctor()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre || !formData.especialidad || !formData.email || !formData.telefono) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }

    setEnviando(true)

    try {
      // Simulamos una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Doctor actualizado",
        description: "La información del doctor ha sido actualizada exitosamente.",
      })

      router.push("/admin/doctores")
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el doctor. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setEnviando(false)
    }
  }

  if (cargando) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <p>Cargando información del doctor...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Información del Doctor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="especialidad">Especialidad *</Label>
              <Select
                value={formData.especialidad}
                onValueChange={(value) => handleSelectChange("especialidad", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cardiología">Cardiología</SelectItem>
                  <SelectItem value="Dermatología">Dermatología</SelectItem>
                  <SelectItem value="Neurología">Neurología</SelectItem>
                  <SelectItem value="Oftalmología">Oftalmología</SelectItem>
                  <SelectItem value="Pediatría">Pediatría</SelectItem>
                  <SelectItem value="Psiquiatría">Psiquiatría</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario">Horario de atención</Label>
              <Input
                id="horario"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                placeholder="Ej: Lunes a Viernes: 9:00 AM - 6:00 PM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={formData.estado} onValueChange={(value) => handleSelectChange("estado", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="biografia">Biografía</Label>
            <Textarea
              id="biografia"
              name="biografia"
              value={formData.biografia}
              onChange={handleChange}
              rows={4}
              placeholder="Información profesional y experiencia del doctor"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/doctores")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={enviando}>
            {enviando ? (
              "Guardando..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}


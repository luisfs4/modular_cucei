"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, Mail, MapPin, Phone, Save, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  imagen: "/placeholder.svg?height=200&width=200",
}

export default function PerfilDoctor() {
  const router = useRouter()
  const [doctor, setDoctor] = useState(doctorMock)
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  // Función para manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDoctor((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Función para guardar cambios
  const guardarCambios = async () => {
    setGuardando(true)

    try {
      // Simulamos una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada exitosamente.",
      })

      setEditando(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar tu perfil. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mi Perfil</CardTitle>
          <CardDescription>Visualiza y actualiza tu información personal y profesional.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-40 h-40">
                <Image
                  src={doctor.imagen || "/placeholder.svg"}
                  alt={doctor.nombre}
                  fill
                  className="rounded-full object-cover border-4 border-background"
                />
              </div>
              {editando && (
                <Button variant="outline" size="sm">
                  Cambiar foto
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    {editando ? (
                      <Input id="nombre" name="nombre" value={doctor.nombre} onChange={handleChange} />
                    ) : (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{doctor.nombre}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="especialidad">Especialidad</Label>
                    {editando ? (
                      <Input
                        id="especialidad"
                        name="especialidad"
                        value={doctor.especialidad}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{doctor.especialidad}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    {editando ? (
                      <Input id="email" name="email" type="email" value={doctor.email} onChange={handleChange} />
                    ) : (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{doctor.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    {editando ? (
                      <Input id="telefono" name="telefono" value={doctor.telefono} onChange={handleChange} />
                    ) : (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{doctor.telefono}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  {editando ? (
                    <Input id="direccion" name="direccion" value={doctor.direccion} onChange={handleChange} />
                  ) : (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{doctor.direccion}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horario">Horario de atención</Label>
                  {editando ? (
                    <Input id="horario" name="horario" value={doctor.horario} onChange={handleChange} />
                  ) : (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{doctor.horario}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biografia">Biografía</Label>
                  {editando ? (
                    <Textarea
                      id="biografia"
                      name="biografia"
                      value={doctor.biografia}
                      onChange={handleChange}
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{doctor.biografia}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {editando ? (
            <>
              <Button variant="outline" onClick={() => setEditando(false)} disabled={guardando}>
                Cancelar
              </Button>
              <Button onClick={guardarCambios} disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar cambios"}
                {!guardando && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditando(true)}>Editar perfil</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}


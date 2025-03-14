"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Mail, MapPin, Phone, Save, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

// Datos de ejemplo para el paciente
const pacienteMock = {
  id: 1,
  nombre: "Ana López",
  email: "ana.lopez@email.com",
  telefono: "555-111-2222",
  direccion: "Calle Principal 123, Ciudad",
  fechaNacimiento: "1988-05-15",
  genero: "Femenino",
  imagen: "/placeholder.svg?height=200&width=200",
}

export default function PerfilPaciente() {
  const [paciente, setPaciente] = useState(pacienteMock)
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  // Función para manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaciente((prev) => ({
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">Visualiza y actualiza tu información personal.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Mantén tu información actualizada para recibir un mejor servicio.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-40 h-40">
                <Image
                  src={paciente.imagen || "/placeholder.svg"}
                  alt={paciente.nombre}
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
                      <Input id="nombre" name="nombre" value={paciente.nombre} onChange={handleChange} />
                    ) : (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{paciente.nombre}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    {editando ? (
                      <Input id="email" name="email" type="email" value={paciente.email} onChange={handleChange} />
                    ) : (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{paciente.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    {editando ? (
                      <Input id="telefono" name="telefono" value={paciente.telefono} onChange={handleChange} />
                    ) : (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{paciente.telefono}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    {editando ? (
                      <Input id="direccion" name="direccion" value={paciente.direccion} onChange={handleChange} />
                    ) : (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{paciente.direccion}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
                    {editando ? (
                      <Input
                        id="fechaNacimiento"
                        name="fechaNacimiento"
                        type="date"
                        value={paciente.fechaNacimiento}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{paciente.fechaNacimiento}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="genero">Género</Label>
                    {editando ? (
                      <Input id="genero" name="genero" value={paciente.genero} onChange={handleChange} />
                    ) : (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{paciente.genero}</span>
                      </div>
                    )}
                  </div>
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


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, Mail, MapPin, Phone, Save, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { doctoresService } from "@/services/doctores-service"
import { UploadImage } from "@/components/upload-image"
import { Skeleton } from "@/components/ui/skeleton"

export default function PerfilDoctor() {
  const router = useRouter()
  const { user } = useAuth()
  const [doctor, setDoctor] = useState<any>(null)
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [subiendoImagen, setSubiendoImagen] = useState(false)

  // Cargar datos del doctor
  useEffect(() => {
    const cargarDoctor = async () => {
      if (user?.access_token) {
        try {
          const data = await doctoresService.getById(user.id, user.access_token)
          setDoctor(data)
        } catch (error) {
          console.error("Error al cargar datos del doctor:", error)
          toast({
            title: "Error",
            description: "No se pudo cargar la información del doctor.",
            variant: "destructive",
          })
        } finally {
          setCargando(false)
        }
      }
    }

    cargarDoctor()
  }, [user])

  // Función para manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDoctor((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Modificar la función handleImageChange para evitar la recarga brusca

  // Función para manejar cambio de imagen
  const handleImageChange = async (file: File) => {
    if (!user?.access_token || !doctor) return

    setSubiendoImagen(true)
    try {
      const result = await doctoresService.updateImage(user.id, file, user.access_token)

      // Actualizar el estado de manera más suave
      setDoctor((prev: any) => ({
        ...prev,
        imagen: result.imagen,
      }))

      toast({
        title: "Imagen actualizada",
        description: "Tu foto de perfil ha sido actualizada exitosamente.",
      })
    } catch (error) {
      console.error("Error al actualizar imagen:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la imagen. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      // Pequeño retraso para evitar parpadeos en la UI
      setTimeout(() => {
        setSubiendoImagen(false)
      }, 300)
    }
  }

  // Función para guardar cambios
  const guardarCambios = async () => {
    if (!user?.access_token || !doctor) return

    setGuardando(true)

    try {
      // Preparar datos para actualizar
      const datosActualizados = {
        nombre: doctor.nombre,
        telefono: doctor.telefono,
        direccion: doctor.direccion,
        biografia: doctor.biografia,
        horario: doctor.horario,
      }

      // Enviar datos a la API
      await doctoresService.update(user.id, datosActualizados, user.access_token)

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada exitosamente.",
      })

      setEditando(false)
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar tu perfil. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="h-40 w-40 rounded-full" />
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <p>No se pudo cargar la información del doctor.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
            {editando ? (
              <UploadImage
                currentImage={doctor.imagen}
                onImageChange={handleImageChange}
                isUploading={subiendoImagen}
              />
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-40 h-40">
                  <Image
                    src={doctor.imagen || "/placeholder.svg?height=200&width=200"}
                    alt={doctor.nombre}
                    width={160}
                    height={160}
                    className="rounded-full object-cover border-4 border-background"
                  />
                </div>
              </div>
            )}

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
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{doctor.especialidad}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{doctor.email}</span>
                    </div>
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


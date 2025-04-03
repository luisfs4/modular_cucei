"use client"

import { useState, useEffect } from "react"
import { Save, Plus, Trash2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { notasMedicasService, type NotaMedica } from "@/services/notas-medicas-service"
import { Skeleton } from "@/components/ui/skeleton"

interface NotasMedicasProps {
  pacienteId: number
}

export default function NotasMedicas({ pacienteId }: NotasMedicasProps) {
  const { user } = useAuth()
  const [notas, setNotas] = useState<NotaMedica[]>([])
  const [nuevaNota, setNuevaNota] = useState("")
  const [editandoNota, setEditandoNota] = useState<number | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [cargando, setCargando] = useState(true)

  // Cargar notas médicas del paciente
  useEffect(() => {
    const cargarNotas = async () => {
      if (user?.access_token) {
        try {
          const notasData = await notasMedicasService.getByPacienteAndDoctor(pacienteId, user.id, user.access_token)
          setNotas(notasData)
        } catch (error) {
          console.error("Error al cargar notas médicas:", error)
          toast({
            title: "Error",
            description: "No se pudieron cargar las notas médicas.",
            variant: "destructive",
          })
        } finally {
          setCargando(false)
        }
      }
    }

    cargarNotas()
  }, [pacienteId, user])

  const guardarNota = async () => {
    if (!user?.access_token) return

    if (!nuevaNota.trim()) {
      toast({
        title: "Error",
        description: "La nota no puede estar vacía.",
        variant: "destructive",
      })
      return
    }

    setGuardando(true)

    try {
      if (editandoNota !== null) {
        // Actualizar nota existente
        const notaActualizada = await notasMedicasService.update(
          editandoNota,
          { contenido: nuevaNota },
          user.access_token,
        )

        // Actualizar el estado local
        setNotas(notas.map((nota) => (nota.id === editandoNota ? notaActualizada : nota)))
      } else {
        // Crear nueva nota
        const fechaActual = new Date().toISOString().split("T")[0]
        const nuevaNotaObj = await notasMedicasService.create(
          {
            pacienteId,
            doctorId: user.id,
            fecha: fechaActual,
            contenido: nuevaNota,
          },
          user.access_token,
        )

        // Actualizar el estado local
        setNotas([nuevaNotaObj, ...notas])
      }

      setNuevaNota("")
      setEditandoNota(null)

      toast({
        title: "Nota guardada",
        description: "La nota médica ha sido guardada exitosamente.",
      })
    } catch (error) {
      console.error("Error al guardar nota:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la nota médica.",
        variant: "destructive",
      })
    } finally {
      setGuardando(false)
    }
  }

  const editarNota = (id: number, contenido: string) => {
    setEditandoNota(id)
    setNuevaNota(contenido)
  }

  const eliminarNota = async (id: number) => {
    if (!user?.access_token) return

    try {
      await notasMedicasService.delete(id, user.access_token)

      // Actualizar el estado local
      setNotas(notas.filter((nota) => nota.id !== id))

      if (editandoNota === id) {
        setEditandoNota(null)
        setNuevaNota("")
      }

      toast({
        title: "Nota eliminada",
        description: "La nota médica ha sido eliminada exitosamente.",
      })
    } catch (error) {
      console.error("Error al eliminar nota:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la nota médica.",
        variant: "destructive",
      })
    }
  }

  if (cargando) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-60 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notas Médicas</CardTitle>
        <CardDescription>Registro de observaciones y diagnósticos del paciente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Textarea
            placeholder="Escribir nueva nota médica..."
            value={nuevaNota}
            onChange={(e) => setNuevaNota(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end">
            {editandoNota !== null && (
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => {
                  setEditandoNota(null)
                  setNuevaNota("")
                }}
              >
                Cancelar
              </Button>
            )}
            <Button onClick={guardarNota} disabled={guardando}>
              {guardando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  {editandoNota !== null ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Actualizar Nota
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Nota
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {notas.length > 0 ? (
            notas.map((nota) => (
              <div key={nota.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium">{nota.fecha}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => editarNota(nota.id, nota.contenido)}>
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => eliminarNota(nota.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{nota.contenido}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay notas médicas registradas para este paciente.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  FileText,
  Calendar,
  User,
  Microscope,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { interpretacionesService } from "@/services/interpretaciones-service"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Tipos de estudios disponibles
const tiposEstudio = [
  { id: "hemograma", nombre: "Hemograma Completo" },
  { id: "quimica_sanguinea", nombre: "Química Sanguínea" },
  { id: "perfil_tiroideo", nombre: "Perfil Tiroideo" },
  { id: "orina", nombre: "Examen General de Orina" },
  { id: "rayos_x", nombre: "Rayos X" },
]

export default function HistorialInterpretaciones() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [interpretaciones, setInterpretaciones] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [interpretacionSeleccionada, setInterpretacionSeleccionada] = useState<any>(null)
  const [dialogoDetalleAbierto, setDialogoDetalleAbierto] = useState(false)
  const [dialogoEliminarAbierto, setDialogoEliminarAbierto] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const elementosPorPagina = 5

  // Cargar interpretaciones
  useEffect(() => {
    const cargarInterpretaciones = async () => {
      if (user?.access_token) {
        try {
          const data = await interpretacionesService.getByDoctor(user.id, user.access_token)
          setInterpretaciones(data)
        } catch (error) {
          console.error("Error al cargar interpretaciones:", error)
          toast({
            title: "Error",
            description: "No se pudieron cargar las interpretaciones.",
            variant: "destructive",
          })
        } finally {
          setCargando(false)
        }
      }
    }

    cargarInterpretaciones()
  }, [user])

  // Filtrar interpretaciones
  const interpretacionesFiltradas = interpretaciones.filter((interpretacion) => {
    const coincideBusqueda =
      interpretacion.paciente?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      interpretacion.tipoEstudio.toLowerCase().includes(busqueda.toLowerCase()) ||
      interpretacion.fecha.includes(busqueda)

    const coincideTipo = filtroTipo ? interpretacion.tipoEstudio === filtroTipo : true

    return coincideBusqueda && coincideTipo
  })

  // Calcular índices para paginación
  const indiceInicial = (paginaActual - 1) * elementosPorPagina
  const indiceFinal = indiceInicial + elementosPorPagina
  const interpretacionesPaginadas = interpretacionesFiltradas.slice(indiceInicial, indiceFinal)
  const totalPaginas = Math.ceil(interpretacionesFiltradas.length / elementosPorPagina)

  // Función para ver detalles de una interpretación
  const verDetalles = (interpretacion: any) => {
    setInterpretacionSeleccionada(interpretacion)
    setDialogoDetalleAbierto(true)
  }

  // Función para confirmar eliminación
  const confirmarEliminar = (interpretacion: any) => {
    setInterpretacionSeleccionada(interpretacion)
    setDialogoEliminarAbierto(true)
  }

  // Función para eliminar interpretación
  const eliminarInterpretacion = async () => {
    if (!user?.access_token || !interpretacionSeleccionada) return

    setEliminando(true)

    try {
      await interpretacionesService.delete(interpretacionSeleccionada.id, user.access_token)

      // Actualizar lista
      setInterpretaciones(interpretaciones.filter((i) => i.id !== interpretacionSeleccionada.id))

      toast({
        title: "Interpretación eliminada",
        description: "La interpretación ha sido eliminada correctamente.",
      })

      setDialogoEliminarAbierto(false)
    } catch (error) {
      console.error("Error al eliminar interpretación:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la interpretación. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setEliminando(false)
    }
  }

  // Obtener nombre del tipo de estudio
  const getNombreTipoEstudio = (id: string) => {
    return tiposEstudio.find((tipo) => tipo.id === id)?.nombre || id
  }

  // Obtener color de badge según estado
  const getColorBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "completado":
        return "success"
      case "pendiente":
        return "default"
      case "revisado":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (cargando) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-10 w-40" />
          </div>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar interpretaciones..."
                className="pl-8"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {tiposEstudio.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {interpretacionesPaginadas.length > 0 ? (
          <div className="space-y-4">
            {interpretacionesPaginadas.map((interpretacion) => (
              <div key={interpretacion.id} className="border rounded-md p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">{getNombreTipoEstudio(interpretacion.tipoEstudio)}</h3>
                  </div>
                  <Badge variant={getColorBadge(interpretacion.estado) as any}>{interpretacion.estado}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{interpretacion.fecha}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{interpretacion.paciente?.nombre}</span>
                  </div>
                  <div className="flex items-center">
                    <Microscope className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{interpretacion.resultados?.hallazgos?.length || 0} hallazgos</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => verDetalles(interpretacion)}>
                    <Eye className="h-4 w-4 mr-1" /> Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => confirmarEliminar(interpretacion)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No se encontraron interpretaciones.</p>
          </div>
        )}

        {/* Paginación */}
        {interpretacionesFiltradas.length > elementosPorPagina && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {indiceInicial + 1} a {Math.min(indiceFinal, interpretacionesFiltradas.length)} de{" "}
              {interpretacionesFiltradas.length} interpretaciones
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Diálogo para ver detalles */}
      <Dialog open={dialogoDetalleAbierto} onOpenChange={setDialogoDetalleAbierto}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Interpretación</DialogTitle>
            <DialogDescription>
              {interpretacionSeleccionada && (
                <div className="flex items-center gap-2 mt-1">
                  <span>{getNombreTipoEstudio(interpretacionSeleccionada.tipoEstudio)}</span>
                  <span>•</span>
                  <span>{interpretacionSeleccionada.fecha}</span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {interpretacionSeleccionada && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{interpretacionSeleccionada.paciente?.nombre}</span>
                </div>
                <Badge variant={getColorBadge(interpretacionSeleccionada.estado) as any}>
                  {interpretacionSeleccionada.estado}
                </Badge>
              </div>

              {/* Parámetros */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Parámetros</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">Parámetro</th>
                        <th className="px-4 py-2 text-left">Valor</th>
                        <th className="px-4 py-2 text-left">Unidad</th>
                        <th className="px-4 py-2 text-left">Referencia</th>
                        <th className="px-4 py-2 text-left">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interpretacionSeleccionada.parametros &&
                        Object.entries(interpretacionSeleccionada.parametros).map(([key, value]: [string, any]) => {
                          // Determinar si el valor está fuera del rango de referencia
                          let estado = "normal"
                          let badgeVariant = "outline"

                          if (value.referencia) {
                            if (typeof value.valor === "number" && typeof value.referencia === "string") {
                              if (value.referencia.includes("-")) {
                                const [min, max] = value.referencia.split("-").map(Number)
                                if (value.valor < min) {
                                  estado = "bajo"
                                  badgeVariant = "destructive"
                                } else if (value.valor > max) {
                                  estado = "alto"
                                  badgeVariant = "destructive"
                                }
                              } else if (value.referencia.startsWith("<")) {
                                const max = Number(value.referencia.substring(1))
                                if (value.valor > max) {
                                  estado = "alto"
                                  badgeVariant = "destructive"
                                }
                              } else if (value.referencia.startsWith(">")) {
                                const min = Number(value.referencia.substring(1))
                                if (value.valor < min) {
                                  estado = "bajo"
                                  badgeVariant = "destructive"
                                }
                              }
                            }
                          }

                          return (
                            <tr key={key} className="border-t">
                              <td className="px-4 py-2 font-medium">{key.replace(/_/g, " ")}</td>
                              <td className="px-4 py-2">{value.valor}</td>
                              <td className="px-4 py-2">{value.unidad || ""}</td>
                              <td className="px-4 py-2">{value.referencia || ""}</td>
                              <td className="px-4 py-2">
                                {value.referencia && <Badge variant={badgeVariant as any}>{estado}</Badge>}
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resultados */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Interpretación</h3>
                <div className="p-4 border rounded-md">
                  <p>{interpretacionSeleccionada.resultados?.interpretacion}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Hallazgos</h4>
                    <div className="p-4 border rounded-md h-full">
                      {interpretacionSeleccionada.resultados?.hallazgos?.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {interpretacionSeleccionada.resultados.hallazgos.map((hallazgo: string, index: number) => (
                            <li key={index}>{hallazgo}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No se encontraron hallazgos significativos.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Recomendaciones</h4>
                    <div className="p-4 border rounded-md h-full">
                      {interpretacionSeleccionada.resultados?.recomendaciones?.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {interpretacionSeleccionada.resultados.recomendaciones.map(
                            (recomendacion: string, index: number) => (
                              <li key={index}>{recomendacion}</li>
                            ),
                          )}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No hay recomendaciones específicas.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {interpretacionSeleccionada.observaciones && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Observaciones</h3>
                  <div className="p-4 border rounded-md">
                    <p>{interpretacionSeleccionada.observaciones}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setDialogoDetalleAbierto(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={dialogoEliminarAbierto} onOpenChange={setDialogoEliminarAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta interpretación? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoEliminarAbierto(false)} disabled={eliminando}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={eliminarInterpretacion} disabled={eliminando}>
              {eliminando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}


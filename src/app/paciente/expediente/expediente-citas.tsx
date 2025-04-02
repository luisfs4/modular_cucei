"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { citasService, type Cita } from "@/services"

export default function ExpedienteCitas() {
  const { user } = useAuth()
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [filtroTab, setFiltroTab] = useState("todas")
  const [citas, setCitas] = useState<Cita[]>([])
  const [cargando, setCargando] = useState(true)

  const elementosPorPagina = 3

  // Cargar citas al montar el componente
  useEffect(() => {
    const cargarCitas = async () => {
      if (user?.access_token) {
        try {
          const data = await citasService.getByPaciente(user.id, user.access_token)
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

  // Filtrar citas por búsqueda y tab
  const citasFiltradas = citas.filter((cita) => {
    const coincideBusqueda =
      cita.doctor.toLowerCase().includes(busqueda.toLowerCase()) ||
      cita.especialidad.toLowerCase().includes(busqueda.toLowerCase()) ||
      cita.fecha.includes(busqueda)

    if (filtroTab === "todas") return coincideBusqueda
    if (filtroTab === "programadas") return coincideBusqueda && cita.estado === "programada"
    if (filtroTab === "completadas") return coincideBusqueda && cita.estado === "completada"
    if (filtroTab === "canceladas") return coincideBusqueda && cita.estado === "cancelada"

    return coincideBusqueda
  })

  // Calcular índices para paginación
  const indiceInicial = (paginaActual - 1) * elementosPorPagina
  const indiceFinal = indiceInicial + elementosPorPagina
  const citasPaginadas = citasFiltradas.slice(indiceInicial, indiceFinal)
  const totalPaginas = Math.ceil(citasFiltradas.length / elementosPorPagina)

  // Función para obtener el color de la badge según el estado
  const getColorBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "completada":
        return "success"
      case "programada":
        return "default"
      case "cancelada":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Renderizar esqueletos durante la carga
  if (cargando) {
    return (
      <div className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar citas..."
            className="pl-8"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link href="/paciente/citas/nueva">
            <Calendar className="mr-2 h-4 w-4" />
            Nueva Cita
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="todas" onValueChange={setFiltroTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="programadas">Programadas</TabsTrigger>
          <TabsTrigger value="completadas">Completadas</TabsTrigger>
          <TabsTrigger value="canceladas">Canceladas</TabsTrigger>
        </TabsList>
        <TabsContent value="todas" className="mt-4">
          <div className="space-y-4">
            {citasPaginadas.length > 0 ? (
              citasPaginadas.map((cita) => (
                <Card key={cita.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{cita.doctor}</CardTitle>
                        <CardDescription>{cita.especialidad}</CardDescription>
                      </div>
                      <Badge variant={getColorBadge(cita.estado) as any}>{cita.estado}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{cita.fecha}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{cita.hora}</span>
                      </div>
                      <div className="flex items-center md:col-span-2">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{cita.ubicacion || "Consultorio Principal"}</span>
                      </div>
                    </div>
                    {cita.notas && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-sm text-muted-foreground">{cita.notas}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-end w-full">
                      {cita.estado.toLowerCase() === "programada" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/paciente/citas/${cita.id}`}>Ver Detalles</Link>
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <p className="text-center text-muted-foreground">No se encontraron citas</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="programadas" className="mt-4">
          <div className="space-y-4">
            {citasPaginadas.length > 0 ? (
              citasPaginadas.map((cita) => (
                <Card key={cita.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{cita.doctor}</CardTitle>
                        <CardDescription>{cita.especialidad}</CardDescription>
                      </div>
                      <Badge variant={getColorBadge(cita.estado) as any}>{cita.estado}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{cita.fecha}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{cita.hora}</span>
                      </div>
                      <div className="flex items-center md:col-span-2">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{cita.ubicacion || "Consultorio Principal"}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-end w-full">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/paciente/citas/${cita.id}`}>Ver Detalles</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <p className="text-center text-muted-foreground">No se encontraron citas programadas</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="completadas" className="mt-4">
          <div className="space-y-4">
            {citasPaginadas.length > 0 ? (
              citasPaginadas.map((cita) => (
                <Card key={cita.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{cita.doctor}</CardTitle>
                        <CardDescription>{cita.especialidad}</CardDescription>
                      </div>
                      <Badge variant={getColorBadge(cita.estado) as any}>{cita.estado}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{cita.fecha}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{cita.hora}</span>
                      </div>
                      <div className="flex items-center md:col-span-2">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{cita.ubicacion || "Consultorio Principal"}</span>
                      </div>
                    </div>
                    {cita.notas && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-sm text-muted-foreground">{cita.notas}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <p className="text-center text-muted-foreground">No se encontraron citas completadas</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="canceladas" className="mt-4">
          <div className="space-y-4">
            {citasPaginadas.length > 0 ? (
              citasPaginadas.map((cita) => (
                <Card key={cita.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{cita.doctor}</CardTitle>
                        <CardDescription>{cita.especialidad}</CardDescription>
                      </div>
                      <Badge variant={getColorBadge(cita.estado) as any}>{cita.estado}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{cita.fecha}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{cita.hora}</span>
                      </div>
                      <div className="flex items-center md:col-span-2">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{cita.ubicacion || "Consultorio Principal"}</span>
                      </div>
                    </div>
                    {cita.notas && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-sm text-muted-foreground">{cita.notas}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <p className="text-center text-muted-foreground">No se encontraron citas canceladas</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Paginación */}
      {citasFiltradas.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {indiceInicial + 1} a {Math.min(indiceFinal, citasFiltradas.length)} de {citasFiltradas.length}{" "}
            citas
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
    </div>
  )
}


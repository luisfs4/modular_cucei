"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileUp, Loader2, Microscope, FileText, AlertTriangle, Brain, Save, FileType } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { interpretacionesService } from "@/services/interpretaciones-service"
import { iaService } from "@/services/ia-service"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Tipos de estudios disponibles
const tiposEstudio = [
  { id: "hemograma", nombre: "Hemograma Completo" },
  { id: "quimica_sanguinea", nombre: "Química Sanguínea" },
  { id: "perfil_tiroideo", nombre: "Perfil Tiroideo" },
  { id: "orina", nombre: "Examen General de Orina" },
  { id: "rayos_x", nombre: "Rayos X" },
]

export default function NuevaInterpretacion() {
  const router = useRouter()
  const { user } = useAuth()
  const [paso, setPaso] = useState(1)
  const [tipoEstudio, setTipoEstudio] = useState("")
  const [pacienteId, setPacienteId] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [archivoUrl, setArchivoUrl] = useState("")
  const [parametros, setParametros] = useState<any>(null)
  const [resultados, setResultados] = useState<any>(null)
  const [observaciones, setObservaciones] = useState("")
  const [cargando, setCargando] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const [analizando, setAnalizando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [servicioIADisponible, setServicioIADisponible] = useState(true)
  const [conversionMensaje, setConversionMensaje] = useState<string | null>(null)
  const [pacientes, setPacientes] = useState<any[]>([
    { id: 1, nombre: "Ana López" },
    { id: 2, nombre: "Pedro Ramírez" },
    { id: 3, nombre: "Sofía Torres" },
  ])

  // Verificar disponibilidad del servicio de IA al cargar
  useEffect(() => {
    const verificarServicioIA = async () => {
      const disponible = await iaService.checkStatus()
      setServicioIADisponible(disponible)

      if (!disponible) {
        toast({
          title: "Servicio de IA no disponible",
          description: "Se utilizará el modo de simulación para el análisis.",
          variant: "destructive",
        })
      }
    }

    verificarServicioIA()
  }, [])

  // Función para manejar la selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar el tipo de archivo
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast({
        title: "Error",
        description: "Solo se permiten imágenes o archivos PDF.",
        variant: "destructive",
      })
      return
    }

    setArchivo(file)
    setConversionMensaje(
      file.type === "application/pdf" ? "El archivo PDF será convertido a imagen para su análisis." : null,
    )
  }

  // Función para subir el archivo
  const subirArchivo = async () => {
    if (!user?.access_token || !archivo) return

    setCargando(true)
    setProgreso(0)

    try {
      // Simular progreso de carga
      const interval = setInterval(() => {
        setProgreso((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return prev
          }
          return prev + 5
        })
      }, 100)

      // Subir archivo
      const resultado = await interpretacionesService.uploadFile(archivo, user.access_token)
      setArchivoUrl(resultado.url)

      // Completar progreso
      clearInterval(interval)
      setProgreso(100)

      toast({
        title: "Archivo subido",
        description: "El archivo se ha subido correctamente.",
      })

      // Avanzar al siguiente paso
      setTimeout(() => {
        setPaso(2)
        // Analizar el archivo con IA o simulación
        analizarArchivo()
      }, 500)
    } catch (error) {
      console.error("Error al subir archivo:", error)
      toast({
        title: "Error",
        description: "No se pudo subir el archivo. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setCargando(false)
    }
  }

  // Función para analizar el archivo con IA o simulación
  const analizarArchivo = async () => {
    if (!tipoEstudio || !archivo) return

    setAnalizando(true)
    setProgreso(0)

    // Simular progreso de análisis
    const interval = setInterval(() => {
      setProgreso((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 10
      })
    }, 200)

    try {
      if (servicioIADisponible) {
        // Usar la API de IA real
        const resultado = await iaService.processImage({
          inputImagen: archivo,
          tipo_estudio: tipoEstudio,
        })

        if (resultado.success) {
          setParametros(resultado.data)

          if (resultado.message) {
            setConversionMensaje(resultado.message)
          }
        } else {
          // Si falla la API, usar simulación como fallback
          toast({
            title: "Error en el análisis",
            description: resultado.message || "Usando simulación como alternativa.",
            variant: "destructive",
          })
          setParametros(iaService.simulateOCR(tipoEstudio))
        }
      } else {
        // Usar simulación si el servicio no está disponible
        setParametros(iaService.simulateOCR(tipoEstudio))
      }

      // Completar progreso
      clearInterval(interval)
      setProgreso(100)

      toast({
        title: "Análisis completado",
        description: "Se han detectado los parámetros del estudio.",
      })
    } catch (error) {
      console.error("Error al analizar archivo:", error)

      // Usar simulación como fallback
      setParametros(iaService.simulateOCR(tipoEstudio))

      toast({
        title: "Error en el análisis",
        description: "Se está utilizando simulación como alternativa.",
        variant: "destructive",
      })
    } finally {
      setAnalizando(false)
    }
  }

  // Función para analizar resultados
  const analizarResultados = () => {
    if (!parametros || !tipoEstudio) return

    setAnalizando(true)
    setProgreso(0)

    // Simular progreso de análisis
    const interval = setInterval(() => {
      setProgreso((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 8
      })
    }, 200)

    // Simular tiempo de procesamiento
    setTimeout(() => {
      // Generar análisis basado en los parámetros detectados
      const resultadosAnalisis = iaService.generarAnalisis(parametros, tipoEstudio)
      setResultados(resultadosAnalisis)

      // Completar progreso
      clearInterval(interval)
      setProgreso(100)

      toast({
        title: "Análisis completado",
        description: "Se ha generado la interpretación del estudio.",
      })

      setAnalizando(false)
      setPaso(3)
    }, 4000)
  }

  // Función para guardar la interpretación
  const guardarInterpretacion = async () => {
    if (!user?.access_token || !tipoEstudio || !pacienteId) return

    setGuardando(true)

    try {
      const fechaActual = new Date().toISOString().split("T")[0]

      // Crear la interpretación
      await interpretacionesService.create(
        {
          pacienteId: Number.parseInt(pacienteId),
          doctorId: user.id,
          fecha: fechaActual,
          tipoEstudio,
          archivoUrl,
          parametros,
          resultados,
          observaciones,
          estado: "completado",
        },
        user.access_token,
      )

      toast({
        title: "Interpretación guardada",
        description: "La interpretación se ha guardado correctamente.",
      })

      // Redirigir al historial
      setTimeout(() => {
        router.push("/doctor/interpretaciones?tab=historial")
      }, 1000)
    } catch (error) {
      console.error("Error al guardar interpretación:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la interpretación. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setGuardando(false)
    }
  }

  // Renderizar paso 1: Selección de tipo de estudio y carga de archivo
  const renderPaso1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileUp className="mr-2 h-5 w-5 text-primary" />
          Subir Estudio
        </CardTitle>
        <CardDescription>Selecciona el tipo de estudio y sube el archivo para comenzar el análisis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tipoEstudio">Tipo de Estudio *</Label>
            <Select value={tipoEstudio} onValueChange={setTipoEstudio} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo de estudio" />
              </SelectTrigger>
              <SelectContent>
                {tiposEstudio.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paciente">Paciente *</Label>
            <Select value={pacienteId} onValueChange={setPacienteId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un paciente" />
              </SelectTrigger>
              <SelectContent>
                {pacientes.map((paciente) => (
                  <SelectItem key={paciente.id} value={paciente.id.toString()}>
                    {paciente.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="archivo">Archivo (PDF o Imagen) *</Label>
          <div className="flex items-center gap-2">
            <Input
              id="archivo"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="flex-1"
            />
            {archivo && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <FileType className="h-3 w-3" />
                {archivo.name}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Sube un archivo PDF o una imagen del estudio médico.</p>

          {conversionMensaje && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-xs text-amber-700 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {conversionMensaje}
              </p>
            </div>
          )}

          {!servicioIADisponible && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-xs text-amber-700 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                El servicio de IA no está disponible. Se utilizará simulación para el análisis.
              </p>
            </div>
          )}
        </div>

        {cargando && (
          <div className="space-y-2">
            <Progress value={progreso} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">Subiendo archivo... {Math.round(progreso)}%</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={subirArchivo} disabled={!tipoEstudio || !pacienteId || !archivo || cargando}>
          {cargando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>Subir y Continuar</>
          )}
        </Button>
      </CardFooter>
    </Card>
  )

  // Renderizar paso 2: Edición de parámetros detectados
  const renderPaso2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Microscope className="mr-2 h-5 w-5 text-primary" />
          Parámetros Detectados
        </CardTitle>
        <CardDescription>Revisa y edita los parámetros detectados en el estudio.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {analizando ? (
          <div className="space-y-4 py-8">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <Progress value={progreso} className="h-2" />
            <p className="text-center text-muted-foreground">Analizando estudio... {Math.round(progreso)}%</p>
          </div>
        ) : parametros ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{tiposEstudio.find((t) => t.id === tipoEstudio)?.nombre}</h3>
              <Badge variant="outline" className="text-xs">
                {archivo?.name}
              </Badge>
            </div>

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
                  {Object.entries(parametros).map(([key, value]: [string, any]) => {
                    // Determinar si el valor está fuera del rango de referencia
                    let badgeVariant = "outline"
                    if (value.nivel === 0) {
                      badgeVariant = "destructive"
                    } else if (value.nivel === 2) {
                      badgeVariant = "destructive"
                    }

                    return (
                      <tr key={key} className="border-t">
                        <td className="px-4 py-2 font-medium">{key.replace(/_/g, " ")}</td>
                        <td className="px-4 py-2">
                          <Input
                            value={value.valor}
                            onChange={(e) => {
                              const newValue = e.target.value
                              setParametros({
                                ...parametros,
                                [key]: { ...value, valor: newValue },
                              })
                            }}
                            className="h-8 w-24"
                          />
                        </td>
                        <td className="px-4 py-2">{value.unidad || ""}</td>
                        <td className="px-4 py-2">{value.referencia || ""}</td>
                        <td className="px-4 py-2">
                          {value.interpretacion && <Badge className="capitalize" variant={badgeVariant as any}>{value.interpretacion}</Badge>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se han detectado parámetros.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setPaso(1)} disabled={analizando}>
          Volver
        </Button>
        <Button onClick={analizarResultados} disabled={!parametros || analizando}>
          {analizando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Analizar Resultados
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )

  // Renderizar paso 3: Resultados e interpretación
  const renderPaso3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Interpretación y Resultados
        </CardTitle>
        <CardDescription>Revisa la interpretación generada y añade tus observaciones.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {resultados ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{tiposEstudio.find((t) => t.id === tipoEstudio)?.nombre}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {pacientes.find((p) => p.id.toString() === pacienteId)?.nombre}
                </Badge>
                {resultados.resultado_general && (
                  <Badge
                    variant={resultados.resultado_general === "normal" ? "outline" : "destructive"}
                    className="text-xs"
                  >
                    {resultados.resultado_general}
                  </Badge>
                )}
              </div>
            </div>

            <Tabs defaultValue="interpretacion" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="interpretacion">Interpretación</TabsTrigger>
                <TabsTrigger value="hallazgos">Hallazgos</TabsTrigger>
                <TabsTrigger value="recomendaciones">Recomendaciones</TabsTrigger>
              </TabsList>
              <TabsContent value="interpretacion" className="p-4 border rounded-md mt-2">
                <p>{resultados.interpretacion}</p>
              </TabsContent>
              <TabsContent value="hallazgos" className="space-y-2 p-4 border rounded-md mt-2">
                {resultados.hallazgos.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {resultados.hallazgos.map((hallazgo: string, index: number) => (
                      <li key={index}>{hallazgo}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No se encontraron hallazgos significativos.</p>
                )}
              </TabsContent>
              <TabsContent value="recomendaciones" className="space-y-2 p-4 border rounded-md mt-2">
                {resultados.recomendaciones.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {resultados.recomendaciones.map((recomendacion: string, index: number) => (
                      <li key={index}>{recomendacion}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No hay recomendaciones específicas.</p>
                )}
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones Adicionales</Label>
              <Textarea
                id="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Añade tus observaciones o notas adicionales..."
                rows={4}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No se han generado resultados.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setPaso(2)} disabled={guardando}>
          Volver
        </Button>
        <Button onClick={guardarInterpretacion} disabled={!resultados || guardando}>
          {guardando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Interpretación
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )

  // Renderizar el paso actual
  switch (paso) {
    case 1:
      return renderPaso1()
    case 2:
      return renderPaso2()
    case 3:
      return renderPaso3()
    default:
      return renderPaso1()
  }
}

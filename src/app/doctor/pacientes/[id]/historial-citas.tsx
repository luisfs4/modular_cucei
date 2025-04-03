import { Clock, MapPin } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HistorialCitasProps {
  citas?: any[]
}

export default function HistorialCitas({ citas = [] }: HistorialCitasProps) {
  // Ordenar citas por fecha (más reciente primero)
  const citasOrdenadas = [...citas].sort((a, b) => {
    const fechaA = new Date(a.fecha).getTime()
    const fechaB = new Date(b.fecha).getTime()
    return fechaB - fechaA
  })

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Citas</CardTitle>
        <CardDescription>Registro de todas las citas del paciente.</CardDescription>
      </CardHeader>
      <CardContent>
        {citasOrdenadas.length > 0 ? (
          <div className="space-y-6">
            {citasOrdenadas.map((cita, index) => (
              <div key={cita.id} className={`${index > 0 ? "border-t pt-6" : ""}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{cita.fecha}</h3>
                    <p className="text-sm text-muted-foreground">{cita.especialidad}</p>
                  </div>
                  <Badge variant={getColorBadge(cita.estado) as any}>{cita.estado}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{cita.hora}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{cita.ubicacion}</span>
                  </div>
                </div>
                {cita.notas && (
                  <div className="mt-2 bg-muted/50 p-3 rounded-md">
                    <p className="text-sm font-medium">Notas:</p>
                    <p className="text-sm text-muted-foreground">{cita.notas}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay citas registradas para este paciente.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NuevaInterpretacion from "./nueva-interpretacion"
import HistorialInterpretaciones from "./historial-interpretaciones"

export default function PaginaInterpretaciones() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interpretación de Estudios</h1>
        <p className="text-muted-foreground">
          Analiza e interpreta estudios médicos para obtener diagnósticos precisos.
        </p>
      </div>

      <Tabs defaultValue="nueva" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nueva">Nueva Interpretación</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>
        <TabsContent value="nueva">
          <NuevaInterpretacion />
        </TabsContent>
        <TabsContent value="historial">
          <HistorialInterpretaciones />
        </TabsContent>
      </Tabs>
    </div>
  )
}


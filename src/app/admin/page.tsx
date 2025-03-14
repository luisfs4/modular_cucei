import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Users, UserPlus, Activity } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al panel de administración de Clínica IA.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+20 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 desde ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="citas">
        <TabsList>
          <TabsTrigger value="citas">Citas Recientes</TabsTrigger>
          <TabsTrigger value="doctores">Doctores Activos</TabsTrigger>
          <TabsTrigger value="pacientes">Nuevos Pacientes</TabsTrigger>
        </TabsList>
        <TabsContent value="citas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Citas Recientes</CardTitle>
              <CardDescription>Listado de las últimas citas programadas en la clínica.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Paciente {i}</p>
                      <p className="text-sm text-muted-foreground">Dr. Nombre Apellido • Cardiología</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Hoy, 10:00 AM</p>
                      <p className="text-sm text-muted-foreground">Consultorio 101</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="doctores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doctores Activos</CardTitle>
              <CardDescription>Listado de los doctores actualmente disponibles.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Dr. Nombre Apellido</p>
                      <p className="text-sm text-muted-foreground">Especialidad</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">8 citas hoy</p>
                      <p className="text-sm text-muted-foreground">Consultorio {100 + i}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pacientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nuevos Pacientes</CardTitle>
              <CardDescription>Listado de los pacientes registrados recientemente.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">Nombre Paciente {i}</p>
                      <p className="text-sm text-muted-foreground">Registrado: {i} días atrás</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Primera cita</p>
                      <p className="text-sm text-muted-foreground">Mañana, 09:00 AM</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


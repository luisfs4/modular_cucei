import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, HeartPulse, Phone, Shield, Stethoscope, Mail, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaginaInicio() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Encabezado */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Clínica IA</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#servicios" className="text-sm font-medium hover:text-primary">
              Servicios
            </Link>
            <Link href="#especialistas" className="text-sm font-medium hover:text-primary">
              Especialistas
            </Link>
            <Link href="#testimonios" className="text-sm font-medium hover:text-primary">
              Testimonios
            </Link>
            <Link href="#contacto" className="text-sm font-medium hover:text-primary">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/paciente/citas/nueva">Agendar Cita</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Cuidamos de tu salud con tecnología y experiencia
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  En Clínica IA combinamos la atención médica de calidad con la última tecnología para ofrecerte el
                  mejor servicio. Nuestro equipo de especialistas está listo para atenderte.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" asChild>
                    <Link href="/paciente/citas/nueva">Agendar una Cita</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#servicios">Conocer Servicios</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[350px] lg:h-[500px] rounded-xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=500&width=800"
                  alt="Equipo médico de Clínica IA"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section id="servicios" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Nuestros Servicios</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Ofrecemos una amplia gama de servicios médicos para cuidar de tu salud y la de tu familia.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardHeader className="pb-2">
                  <Stethoscope className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Consultas Médicas</CardTitle>
                  <CardDescription>Atención médica personalizada con los mejores especialistas.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Nuestros médicos te brindarán un diagnóstico preciso y un tratamiento adecuado para tus necesidades.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Calendar className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Citas en Línea</CardTitle>
                  <CardDescription>
                    Agenda tus citas de manera rápida y sencilla desde cualquier dispositivo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Nuestro sistema de citas en línea te permite elegir el horario que mejor se adapte a tu agenda.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Shield className="h-6 w-6 text-primary mb-2" />
                  <CardTitle>Exámenes Médicos</CardTitle>
                  <CardDescription>Realizamos todo tipo de exámenes con equipos de última generación.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Contamos con laboratorio propio para entregarte resultados precisos en el menor tiempo posible.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Especialistas */}
        <section id="especialistas" className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Nuestros Especialistas</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Contamos con un equipo de médicos altamente calificados en diversas especialidades.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={`/placeholder.svg?height=200&width=300&text=Doctor+${i}`}
                        alt={`Doctor ${i}`}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-bold">Dr. Nombre Apellido</h3>
                    <p className="text-sm text-muted-foreground">Especialidad</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section id="testimonios" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Testimonios</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Lo que nuestros pacientes dicen sobre nosotros.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-muted/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <p className="italic text-muted-foreground">
                        "Excelente atención médica. El doctor fue muy amable y profesional. Recomiendo ampliamente esta
                        clínica."
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden">
                          <Image
                            src={`/placeholder.svg?height=40&width=40&text=${i}`}
                            alt={`Paciente ${i}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">Nombre del Paciente</p>
                          <p className="text-xs text-muted-foreground">Paciente desde 2022</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Contáctanos</h2>
                <p className="text-muted-foreground md:text-xl">
                  Estamos aquí para ayudarte. No dudes en contactarnos para cualquier consulta o información adicional.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>+123 456 7890</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>info@clinicaia.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Av. Principal 123, Ciudad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Lunes a Viernes: 8:00 AM - 8:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="relative h-[300px] rounded-xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=500&text=Mapa"
                  alt="Ubicación de Clínica IA"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Pie de página */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-primary" />
            <span className="font-semibold">Clínica IA</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2023 Clínica IA. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}


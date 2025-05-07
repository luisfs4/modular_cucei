"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, HeartPulse, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

// Importar el hook de autenticación
import { useAuth } from "@/hooks/use-auth"

// Modificar el componente PaginaLogin para usar el hook
export default function PaginaLogin() {
  const router = useRouter()
  const { login, loading: cargando, isAuthenticated, user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("paciente")
  const [showPassword, setShowPassword] = useState(false)

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirigir según el rol
      if (user.rol === "doctor") {
        router.push("/doctor/calendario")
      } else if (user.rol === "admin") {
        router.push("/admin")
      } else {
        router.push("/paciente/expediente")
      }
    }
  }, [isAuthenticated, user, router])

  // Función para manejar el inicio de sesión
  const handleLogin = async (tipo: string, e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      })
      return
    }

    try {
      // Cerrar cualquier sesión existente antes de iniciar una nueva
      const response = await login(
        {
          username: email,
          password: password,
        },
        true,
      )

      // Verificar si el rol del usuario coincide con la pestaña seleccionada
      if (response && response.user) {
        const userRole = response.user.rol

        if (tipo === "paciente" && userRole !== "paciente") {
          toast({
            title: "Acceso denegado",
            description: "Esta cuenta no pertenece a un paciente. Por favor, utiliza la pestaña correcta.",
            variant: "destructive",
          })
          // Cerrar la sesión que acabamos de iniciar
          // Aquí podrías implementar un método logout() en tu hook de autenticación
          return
        }

        if (tipo === "doctor" && userRole !== "doctor" && userRole !== "admin") {
          toast({
            title: "Acceso denegado",
            description:
              "Esta cuenta no pertenece a un doctor o administrador. Por favor, utiliza la pestaña correcta.",
            variant: "destructive",
          })
          // Cerrar la sesión que acabamos de iniciar
          return
        }
      }
    } catch (error) {
      toast({
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas. Inténtalo de nuevo.",
        variant: "destructive",
      })
      setError("Credenciales incorrectas")
    }
  }

  // Función para mostrar la alerta de recuperación de contraseña
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    toast({
      title: "Recuperación de contraseña",
      description: (
        <div className="space-y-2">
          <p>Para restablecer tu contraseña, es necesario contactar al administrador:</p>
          <p className="font-medium">Luis Sanchez</p>
          <p className="text-sm">
            <a href="mailto:luis@programoporcomida.com" className="text-primary underline">
              luis@programoporcomida.com
            </a>
          </p>
        </div>
      ),
      duration: 6000,
    })
  }

  // Si ya está autenticado, mostrar un mensaje de carga mientras se redirige
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2">Ya has iniciado sesión. Redirigiendo...</p>
        </div>
      </div>
    )
  }

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const tabContentVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.2 } },
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      {/* Botón para volver al inicio con texto - Ahora fuera de la animación principal */}
      <div className="fixed top-4 left-4 md:top-8 md:left-8 z-10">
        <Button variant="outline" asChild className="gap-2 rounded-full bg-background/80 backdrop-blur-sm">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
          </Link>
        </Button>
      </div>

      <motion.div className="w-full max-w-md" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div className="flex justify-center mb-6" variants={itemVariants}>
          <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Clínica IA</span>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="paciente" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="paciente">Paciente</TabsTrigger>
              <TabsTrigger value="doctor">Doctor</TabsTrigger>
            </TabsList>

            {/* Contenedor con altura fija para evitar el "brinquito" */}
            <div className="relative min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={tabContentVariants}
                  className="absolute w-full"
                >
                  {activeTab === "paciente" ? (
                    <TabsContent value="paciente" forceMount>
                      <Card>
                        <CardHeader>
                          <CardTitle>Iniciar Sesión como Paciente</CardTitle>
                          <CardDescription>
                            Ingresa tus credenciales para acceder a tu cuenta de paciente.
                          </CardDescription>
                        </CardHeader>
                        <form onSubmit={(e) => handleLogin("paciente", e)}>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="email-paciente">Correo electrónico</Label>
                              <Input
                                id="email-paciente"
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="password-paciente">Contraseña</Label>
                                <button
                                  type="button"
                                  onClick={handleForgotPassword}
                                  className="text-xs text-primary hover:underline"
                                >
                                  ¿Olvidaste tu contraseña?
                                </button>
                              </div>
                              <div className="relative">
                                <Input
                                  id="password-paciente"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                  className="pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                                  onClick={() => setShowPassword(!showPassword)}
                                  tabIndex={-1}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                                  ) : (
                                    <Eye className="h-4 w-4" aria-hidden="true" />
                                  )}
                                  <span className="sr-only">
                                    {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex flex-col">
                            <Button type="submit" className="w-full" disabled={cargando}>
                              {cargando ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Iniciando sesión...
                                </>
                              ) : (
                                "Iniciar Sesión"
                              )}
                            </Button>
                            <p className="mt-4 text-center text-sm text-muted-foreground">
                              ¿No tienes una cuenta?{" "}
                              <Link href="#" className="text-primary hover:underline">
                                Regístrate
                              </Link>
                            </p>
                          </CardFooter>
                        </form>
                      </Card>
                    </TabsContent>
                  ) : (
                    <TabsContent value="doctor" forceMount>
                      <Card>
                        <CardHeader>
                          <CardTitle>Iniciar Sesión como Doctor</CardTitle>
                          <CardDescription>
                            Ingresa tus credenciales para acceder a tu cuenta de doctor o administrador.
                          </CardDescription>
                        </CardHeader>
                        <form onSubmit={(e) => handleLogin("doctor", e)}>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="email-doctor">Correo electrónico</Label>
                              <Input
                                id="email-doctor"
                                type="email"
                                placeholder="doctor@clinica.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="password-doctor">Contraseña</Label>
                                <button
                                  type="button"
                                  onClick={handleForgotPassword}
                                  className="text-xs text-primary hover:underline"
                                >
                                  ¿Olvidaste tu contraseña?
                                </button>
                              </div>
                              <div className="relative">
                                <Input
                                  id="password-doctor"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                  className="pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                                  onClick={() => setShowPassword(!showPassword)}
                                  tabIndex={-1}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                                  ) : (
                                    <Eye className="h-4 w-4" aria-hidden="true" />
                                  )}
                                  <span className="sr-only">
                                    {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex flex-col">
                            <Button type="submit" className="w-full" disabled={cargando}>
                              {cargando ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Iniciando sesión...
                                </>
                              ) : (
                                "Iniciar Sesión"
                              )}
                            </Button>
                          </CardFooter>
                        </form>
                      </Card>
                    </TabsContent>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}

"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { HeartPulse, Loader2 } from "lucide-react"

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
  const { login, loading: cargando } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

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
      await login({
        username: email,
        password: password,
      })
    } catch (error) {
      toast({
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas. Inténtalo de nuevo.",
        variant: "destructive",
      })
      setError("Credenciales incorrectas")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Clínica IA</span>
          </Link>
        </div>

        <Tabs defaultValue="paciente" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="paciente">Paciente</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
          </TabsList>

          <TabsContent value="paciente">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión como Paciente</CardTitle>
                <CardDescription>Ingresa tus credenciales para acceder a tu cuenta de paciente.</CardDescription>
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
                      <Link href="#" className="text-xs text-primary hover:underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <Input
                      id="password-paciente"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
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

          <TabsContent value="doctor">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión como Doctor</CardTitle>
                <CardDescription>Ingresa tus credenciales para acceder a tu cuenta de doctor.</CardDescription>
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
                      <Link href="#" className="text-xs text-primary hover:underline">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <Input
                      id="password-doctor"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
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
        </Tabs>
      </div>
    </div>
  )
}


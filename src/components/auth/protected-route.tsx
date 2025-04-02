"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    } else if (!loading && isAuthenticated && allowedRoles.length > 0) {
      // Verificar si el usuario tiene un rol permitido
      if (user && !allowedRoles.includes(user.rol)) {
        // Redirigir según el rol
        if (user.rol === "doctor") {
          router.push("/doctor/calendario")
        } else if (user.rol === "admin") {
          router.push("/admin")
        } else {
          router.push("/paciente/expediente")
        }
      }
    }
  }, [loading, isAuthenticated, router, user, allowedRoles])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.rol)) {
    return null
  }

  return <>{children}</>
}


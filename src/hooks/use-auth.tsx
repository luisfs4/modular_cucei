"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService, type LoginRequest, type LoginResponse } from "@/services/auth-service"
import { safeLocalStorage } from "@/lib/browser-utils"

interface AuthContextType {
  user: LoginResponse | null
  loading: boolean
  login: (credentials: LoginRequest, forceLogout?: boolean) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verify if there's a token stored using our safe utility
    const token = safeLocalStorage.getItem("token")
    const userData = safeLocalStorage.getItem("user")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Verify if the token is valid
        authService
          .validateToken(token)
          .then((isValid) => {
            if (!isValid) {
              logout()
            }
          })
          .catch(() => {
            logout()
          })
      } catch (error) {
        logout()
      }
    }

    setLoading(false)
  }, [])

  const login = async (credentials: LoginRequest, forceLogout = false) => {
    setLoading(true)
    try {
      // Si forceLogout es true o ya hay un usuario autenticado, cerrar sesión primero
      if (forceLogout || user) {
        // Limpiar datos de sesión existentes
        safeLocalStorage.removeItem("token")
        safeLocalStorage.removeItem("user")
        setUser(null)
      }

      const response = await authService.login(credentials)

      // Save token and user info using our safe utility
      safeLocalStorage.setItem("token", response.access_token)
      safeLocalStorage.setItem("user", JSON.stringify(response))

      setUser(response)

      // Redirect based on role
      if (response.rol === "doctor") {
        router.push("/doctor/calendario")
      } else if (response.rol === "admin") {
        router.push("/admin")
      } else {
        router.push("/paciente/expediente")
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    safeLocalStorage.removeItem("token")
    safeLocalStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

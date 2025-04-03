"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService, type LoginRequest, type LoginResponse } from "@/services/auth-service"

interface AuthContextType {
  user: LoginResponse | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if code is running in browser environment
    if (typeof window !== "undefined") {
      // Verify if there's a token stored
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

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
    }

    setLoading(false)
  }, [])

  const login = async (credentials: LoginRequest) => {
    setLoading(true)
    try {
      const response = await authService.login(credentials)

      // Guardar el token y la información del usuario
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.access_token)
        localStorage.setItem("user", JSON.stringify(response))
      }

      setUser(response)

      // Redirigir según el rol
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
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
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


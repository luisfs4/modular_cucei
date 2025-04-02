import { API_URL, defaultOptions, handleApiError } from "@/lib/api-config"

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  rol: string
  id: number
}

export interface ForgetPasswordRequest {
  email: string
}

export const authService = {
  // Iniciar sesión
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const formData = new URLSearchParams()
    formData.append("username", credentials.username)
    formData.append("password", credentials.password)

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })

    await handleApiError(response)
    return response.json()
  },

  // Solicitar recuperación de contraseña
  async forgetPassword(data: ForgetPasswordRequest): Promise<void> {
    const response = await fetch(`${API_URL}/auth/forget_password`, {
      method: "POST",
      headers: defaultOptions.headers,
      body: JSON.stringify(data),
    })

    await handleApiError(response)
    return
  },

  // Verificar si el token es válido
  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/perfil`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.ok
    } catch (error) {
      return false
    }
  },
}


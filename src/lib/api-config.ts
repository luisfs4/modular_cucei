// Configuración base para la API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Opciones por defecto para fetch
export const defaultOptions: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
}

// Función para incluir el token de autenticación en las peticiones
export const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

// Función para manejar errores de la API
export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw {
      status: response.status,
      statusText: response.statusText,
      data: errorData,
    }
  }
  return response
}


import { API_URL, getAuthHeaders, handleApiError } from "@/lib/api-config"

export interface Paciente {
  id_paciente: number
  fechaNacimiento: string
  direccion?: string
  estado?: boolean
  nombre?: string
  tel?: number
  genero?: string
  edad?: number
  email?: string
  imagen?: string
}

export interface PacientePost {
  fechaNacimiento?: string
  direccion?: string
  nombre?: string
  tel?: number
  password?: string
  genero?: string
  edad?: number
  email?: string
  imagen?: File
}

export interface PacientePut {
  fechaNacimiento?: string
  direccion?: string
  nombre?: string
  tel?: number
  password?: string
  imagen?: File
  genero?: string
  edad?: number
  email?: string
}

export const pacientesService = {
  // Obtener todos los pacientes
  async getAll(token: string): Promise<Paciente[]> {
    const response = await fetch(`${API_URL}/usuarios`, {
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return response.json()
  },

  // Obtener un paciente por ID
  async getById(id: number, token: string): Promise<Paciente> {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return response.json()
  },

  // Crear un nuevo paciente
  async create(paciente: PacientePost, token?: string): Promise<any> {
    const formData = new FormData()

    // Añadir todos los campos al FormData
    Object.entries(paciente).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string | Blob)
      }
    })

    const response = await fetch(`${API_URL}/usuarios/`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    })

    await handleApiError(response)
    return response.json()
  },

  // Actualizar un paciente
  async update(id: number, paciente: PacientePut, token: string): Promise<any> {
    const formData = new FormData()

    // Añadir todos los campos al FormData
    Object.entries(paciente).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string | Blob)
      }
    })

    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    })

    await handleApiError(response)
    return response.json()
  },

  // Eliminar un paciente
  async delete(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return
  },
}


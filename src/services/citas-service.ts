import { API_URL, getAuthHeaders, handleApiError } from "@/lib/api-config"

export interface Cita {
  id: number
  fecha: string
  hora: string
  ubicacion?: string
  estado: string
  notas?: string
  doctor: string
  especialidad: string
}

export interface CitaPost {
  id_paciente: number
  fecha: string
  hora: string
  motivo?: string
  estado?: string
  id_medico: number
  notas?: string
  duracion: number
  ubicacion: string
}

export interface CitaPut {
  fecha?: string
  hora?: string
  motivo?: string
  estado?: string
  notas?: string
}

export const citasService = {
  // Obtener todas las citas
  async getAll(token: string): Promise<Cita[]> {
    const response = await fetch(`${API_URL}/citas`, {
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return response.json()
  },

  // Obtener una cita por ID
  async getById(id: number, token: string): Promise<Cita> {
    const response = await fetch(`${API_URL}/citas/${id}`, {
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return response.json()
  },

  // Crear una nueva cita
  async create(cita: CitaPost, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/citas`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(cita),
    })

    await handleApiError(response)
    return
  },

  // Actualizar una cita
  async update(id: number, cita: CitaPut, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/citas/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(token),
      body: JSON.stringify(cita),
    })

    await handleApiError(response)
    return
  },

  // Eliminar una cita
  async delete(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/citas/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return
  },

  // Obtener citas por doctor
  async getByDoctor(id: number, token: string): Promise<Cita[]> {
    const response = await fetch(`${API_URL}/citas/doctor/${id}`, {
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return response.json()
  },

  // Obtener citas por paciente
  async getByPaciente(id: number, token: string): Promise<Cita[]> {
    const response = await fetch(`${API_URL}/citas/paciente/${id}`, {
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return response.json()
  },
}


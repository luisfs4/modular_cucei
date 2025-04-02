import { API_URL, getAuthHeaders, handleApiError } from "@/lib/api-config"

export interface Doctor {
  id_medico?: number
  telefono?: string
  estado?: boolean
  nombre?: string
  email?: string
  direccion?: string
  biografia?: string
  imagen?: string
  horario?: string
  password?: string
  id_especialidad?: number
}

export interface DoctorPost {
  telefono: string
  nombre: string
  email: string
  direccion: string
  biografia?: string
  imagen: File
  horario: string
  password: string
  id_especialidad: number
}

export interface DoctorPut {
  telefono?: string
  nombre?: string
  email?: string
  direccion?: string
  biografia?: string
  imagen?: File
  horario?: string
  password?: string
  id_especialidad?: number
}

export interface DoctorPaciente {
  id_paciente: number
  direccion?: string
  estado: boolean
  nombre: string
  tel?: number
  genero?: string
  edad?: number
  email?: string
  imagen?: string
  ultima_visita: string
  proxima_cita: string
}

export interface OptionDoctor {
  id: number
  nombre?: string
  especialidad?: string
}

export const doctoresService = {
  // Obtener todos los doctores
  async getAll(token: string, skip = 0, limit = 100): Promise<Doctor[]> {
    const response = await fetch(`${API_URL}/doctores?skip=${skip}&limit=${limit}`, {
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return response.json()
  },

  // Obtener un doctor por ID
  async getById(id: number, token: string): Promise<Doctor> {
    const response = await fetch(`${API_URL}/doctores/${id}`, {
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return response.json()
  },

  // Crear un nuevo doctor
  async create(doctor: DoctorPost, token: string): Promise<any> {
    const formData = new FormData()

    // Añadir todos los campos al FormData
    Object.entries(doctor).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string | Blob)
      }
    })

    const response = await fetch(`${API_URL}/doctores`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    })

    await handleApiError(response)
    return response.json()
  },

  // Actualizar un doctor
  async update(id: number, doctor: DoctorPut, token: string): Promise<any> {
    const formData = new FormData()

    // Añadir todos los campos al FormData
    Object.entries(doctor).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string | Blob)
      }
    })

    const response = await fetch(`${API_URL}/doctores/${id}`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    })

    await handleApiError(response)
    return response.json()
  },

  // Eliminar un doctor
  async delete(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/doctores/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return
  },

  // Obtener pacientes de un doctor
  async getPacientes(id: number, token: string): Promise<DoctorPaciente[]> {
    const response = await fetch(`${API_URL}/doctores/${id}/paciente`, {
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return response.json()
  },

  // Obtener especialidades de doctores
  async getEspecialidades(token: string): Promise<OptionDoctor[]> {
    const response = await fetch(`${API_URL}/citas/doctor/especialidad/`, {
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return response.json()
  },
}


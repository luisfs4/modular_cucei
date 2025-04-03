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
  especialidad?: string
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
  estado: string
  nombre: string
  tel?: string
  genero?: string
  edad?: number
  email?: string
  imagen?: string
  ultima_visita: string
  proxima_cita: string | null
}

export interface OptionDoctor {
  id: number
  nombre?: string
  especialidad?: string
}

export const doctoresService = {
  // Obtener todos los doctores
  async getAll(token: string, skip = 0, limit = 100): Promise<Doctor[]> {
    const response = await fetch(`/api/doctores?skip=${skip}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al obtener doctores")
    }

    return response.json()
  },

  // Obtener un doctor por ID
  async getById(id: number, token: string): Promise<Doctor> {
    const response = await fetch(`/api/doctores/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al obtener doctor")
    }

    return response.json()
  },

  // Actualizar un doctor
  async update(id: number, data: DoctorPut, token: string): Promise<Doctor> {
    const response = await fetch(`/api/doctores/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Error al actualizar doctor")
    }

    return response.json()
  },

  // Actualizar la imagen de un doctor
  async updateImage(id: number, imageFile: File, token: string): Promise<{ success: boolean; imagen: string }> {
    const formData = new FormData()
    formData.append("imagen", imageFile)

    const response = await fetch(`/api/doctores/${id}/imagen`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Error al actualizar imagen")
    }

    return response.json()
  },

  // Obtener especialidades de doctores
  async getEspecialidades(token: string): Promise<OptionDoctor[]> {
    const response = await fetch("/api/especialidades", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al obtener especialidades")
    }

    return response.json()
  },

  // Obtener pacientes de un doctor
  async getPacientes(doctorId: number, token: string): Promise<DoctorPaciente[]> {
    const response = await fetch(`/api/doctores/${doctorId}/pacientes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al obtener pacientes del doctor")
    }

    return response.json()
  },
}


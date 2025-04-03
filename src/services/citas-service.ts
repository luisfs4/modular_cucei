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
    const response = await fetch("/api/citas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al obtener citas")
    }

    return response.json()
  },

  // Obtener una cita por ID
  async getById(id: number, token: string): Promise<Cita> {
    const response = await fetch(`/api/citas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al obtener cita")
    }

    return response.json()
  },

  // Crear una nueva cita
  async create(cita: CitaPost, token: string): Promise<void> {
    const response = await fetch("/api/citas", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cita),
    })

    if (!response.ok) {
      throw new Error("Error al crear cita")
    }
  },

  // Actualizar una cita
  async update(id: number, cita: CitaPut, token: string): Promise<void> {
    const response = await fetch(`/api/citas/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cita),
    })

    if (!response.ok) {
      throw new Error("Error al actualizar cita")
    }
  },

  // Obtener citas por doctor
  async getByDoctor(id: number, token: string): Promise<Cita[]> {
    const response = await fetch(`/api/citas/doctor/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al obtener citas por doctor")
    }

    return response.json()
  },

  // Obtener citas por paciente
  async getByPaciente(id: number, token: string): Promise<Cita[]> {
    const response = await fetch(`/api/citas/paciente/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al obtener citas por paciente")
    }

    return response.json()
  },
}


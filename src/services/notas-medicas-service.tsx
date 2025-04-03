export interface NotaMedica {
    id: number
    fecha: string
    contenido: string
    pacienteId: number
    doctorId: number
    createdAt: string
    updatedAt: string
    doctor?: {
        nombre: string
        especialidad: {
            nombre: string
        }
    }
}

export interface NotaMedicaPost {
    pacienteId: number
    doctorId: number
    fecha: string
    contenido: string
}

export interface NotaMedicaPut {
    contenido: string
}

export const notasMedicasService = {
    // Obtener todas las notas médicas de un paciente
    async getByPaciente(pacienteId: number, token: string): Promise<NotaMedica[]> {
        const response = await fetch(`/api/notas-medicas?pacienteId=${pacienteId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Error al obtener notas médicas")
        }

        return response.json()
    },

    // Obtener todas las notas médicas de un doctor
    async getByDoctor(doctorId: number, token: string): Promise<NotaMedica[]> {
        const response = await fetch(`/api/notas-medicas?doctorId=${doctorId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Error al obtener notas médicas")
        }

        return response.json()
    },

    // Obtener notas médicas de un paciente atendido por un doctor específico
    async getByPacienteAndDoctor(pacienteId: number, doctorId: number, token: string): Promise<NotaMedica[]> {
        const response = await fetch(`/api/notas-medicas?pacienteId=${pacienteId}&doctorId=${doctorId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Error al obtener notas médicas")
        }

        return response.json()
    },

    // Obtener una nota médica por ID
    async getById(id: number, token: string): Promise<NotaMedica> {
        const response = await fetch(`/api/notas-medicas/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Error al obtener nota médica")
        }

        return response.json()
    },

    // Crear una nueva nota médica
    async create(nota: NotaMedicaPost, token: string): Promise<NotaMedica> {
        const response = await fetch("/api/notas-medicas", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(nota),
        })

        if (!response.ok) {
            throw new Error("Error al crear nota médica")
        }

        return response.json()
    },

    // Actualizar una nota médica
    async update(id: number, nota: NotaMedicaPut, token: string): Promise<NotaMedica> {
        const response = await fetch(`/api/notas-medicas/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(nota),
        })

        if (!response.ok) {
            throw new Error("Error al actualizar nota médica")
        }

        return response.json()
    },

    // Eliminar una nota médica
    async delete(id: number, token: string): Promise<void> {
        const response = await fetch(`/api/notas-medicas/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Error al eliminar nota médica")
        }
    },
}

import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { verify } from "jsonwebtoken"

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

// Clave secreta para JWT (debe coincidir con la de auth-service)
const JWT_SECRET = "clinica-ia-secret-key"

export const pacientesService = {
  // Obtener todos los pacientes
  async getAll(token: string): Promise<Paciente[]> {
    try {
      // Verificar token
      verify(token, JWT_SECRET)

      // Obtener todos los usuarios con rol paciente
      const pacientes = await prisma.usuario.findMany({
        where: { rol: "paciente" },
      })

      // Transformar a formato esperado por el frontend
      return pacientes.map((p) => ({
        id_paciente: p.id,
        fechaNacimiento: p.fechaNacimiento || "",
        direccion: p.direccion || "",
        estado: p.estado,
        nombre: p.nombre,
        tel: p.telefono ? Number.parseInt(p.telefono) : undefined,
        genero: p.genero || "",
        edad: p.fechaNacimiento ? new Date().getFullYear() - new Date(p.fechaNacimiento).getFullYear() : undefined,
        email: p.email,
        imagen: p.imagen,
      }))
    } catch (error) {
      throw new Error("No autorizado")
    }
  },

  // Obtener un paciente por ID
  async getById(id: number, token: string): Promise<Paciente> {
    try {
      // Verificar token
      verify(token, JWT_SECRET)

      // Obtener paciente por ID
      const paciente = await prisma.usuario.findFirst({
        where: { id, rol: "paciente" },
      })

      if (!paciente) {
        throw new Error("Paciente no encontrado")
      }

      // Transformar a formato esperado por el frontend
      return {
        id_paciente: paciente.id,
        fechaNacimiento: paciente.fechaNacimiento || "",
        direccion: paciente.direccion || "",
        estado: paciente.estado,
        nombre: paciente.nombre,
        tel: paciente.telefono ? Number.parseInt(paciente.telefono) : undefined,
        genero: paciente.genero || "",
        edad: paciente.fechaNacimiento
          ? new Date().getFullYear() - new Date(paciente.fechaNacimiento).getFullYear()
          : undefined,
        email: paciente.email,
        imagen: paciente.imagen,
      }
    } catch (error) {
      throw new Error("No autorizado")
    }
  },

  // Crear un nuevo paciente
  async create(paciente: PacientePost, token?: string): Promise<any> {
    // Si hay token, verificarlo (para admin)
    if (token) {
      try {
        verify(token, JWT_SECRET)
      } catch (error) {
        throw new Error("No autorizado")
      }
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: paciente.email },
    })

    if (existingUser) {
      throw new Error("El email ya está registrado")
    }

    // Hashear la contraseña
    const hashedPassword = await hash(paciente.password || "123456", 10)

    // Crear el paciente
    const newPaciente = await prisma.usuario.create({
      data: {
        nombre: paciente.nombre || "",
        email: paciente.email || "",
        password: hashedPassword,
        telefono: paciente.tel?.toString(),
        direccion: paciente.direccion,
        fechaNacimiento: paciente.fechaNacimiento,
        genero: paciente.genero,
        rol: "paciente",
        // En un caso real, aquí manejaríamos la subida de la imagen
        imagen: "/placeholder.svg?height=200&width=200",
      },
    })

    return {
      id: newPaciente.id,
      nombre: newPaciente.nombre,
      email: newPaciente.email,
    }
  },

  // Actualizar un paciente
  async update(id: number, paciente: PacientePut, token: string): Promise<any> {
    try {
      // Verificar token
      verify(token, JWT_SECRET)

      // Verificar si el paciente existe
      const existingPaciente = await prisma.usuario.findFirst({
        where: { id, rol: "paciente" },
      })

      if (!existingPaciente) {
        throw new Error("Paciente no encontrado")
      }

      // Preparar datos para actualizar
      const updateData: any = {}

      if (paciente.nombre) updateData.nombre = paciente.nombre
      if (paciente.email) updateData.email = paciente.email
      if (paciente.tel) updateData.telefono = paciente.tel.toString()
      if (paciente.direccion) updateData.direccion = paciente.direccion
      if (paciente.fechaNacimiento) updateData.fechaNacimiento = paciente.fechaNacimiento
      if (paciente.genero) updateData.genero = paciente.genero
      if (paciente.password) updateData.password = await hash(paciente.password, 10)
      // En un caso real, aquí manejaríamos la actualización de la imagen

      // Actualizar el paciente
      const updatedPaciente = await prisma.usuario.update({
        where: { id },
        data: updateData,
      })

      return {
        id: updatedPaciente.id,
        nombre: updatedPaciente.nombre,
        email: updatedPaciente.email,
      }
    } catch (error) {
      throw new Error("No autorizado")
    }
  },

  // Eliminar un paciente
  async delete(id: number, token: string): Promise<void> {
    try {
      // Verificar token
      verify(token, JWT_SECRET)

      // Verificar si el paciente existe
      const existingPaciente = await prisma.usuario.findFirst({
        where: { id, rol: "paciente" },
      })

      if (!existingPaciente) {
        throw new Error("Paciente no encontrado")
      }

      // Eliminar el paciente
      await prisma.usuario.delete({
        where: { id },
      })
    } catch (error) {
      throw new Error("No autorizado")
    }
  },
}


import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verify } from "jsonwebtoken"
import { hash } from "bcryptjs"

// Clave secreta para JWT
const JWT_SECRET = "clinica-ia-secret-key"

// Función para verificar el token
function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Obtener token del header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    // Obtener doctor por ID
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        especialidad: true,
      },
    })

    if (!doctor) {
      return NextResponse.json({ error: "Doctor no encontrado" }, { status: 404 })
    }

    // Transformar a formato esperado por el frontend
    const formattedDoctor = {
      id_medico: doctor.id,
      nombre: doctor.nombre,
      email: doctor.email,
      telefono: doctor.telefono,
      direccion: doctor.direccion || "",
      biografia: doctor.biografia || "",
      horario: doctor.horario || "",
      imagen: doctor.imagen || "/placeholder.svg?height=200&width=200",
      especialidad: doctor.especialidad.nombre,
      id_especialidad: doctor.especialidadId,
      estado: doctor.estado,
    }

    return NextResponse.json(formattedDoctor)
  } catch (error) {
    console.error("Error al obtener doctor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Obtener token del header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    // Verificar si el doctor existe
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
    })

    if (!existingDoctor) {
      return NextResponse.json({ error: "Doctor no encontrado" }, { status: 404 })
    }

    // Obtener datos para actualizar
    const body = await request.json()
    const { nombre, telefono, direccion, biografia, horario, password } = body

    // Preparar datos para actualizar
    const updateData: any = {}

    if (nombre) updateData.nombre = nombre
    if (telefono) updateData.telefono = telefono
    if (direccion) updateData.direccion = direccion
    if (biografia) updateData.biografia = biografia
    if (horario) updateData.horario = horario
    if (password) updateData.password = await hash(password, 10)

    // Actualizar el doctor
    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: updateData,
      include: {
        especialidad: true,
      },
    })

    // Transformar a formato esperado por el frontend
    const formattedDoctor = {
      id_medico: updatedDoctor.id,
      nombre: updatedDoctor.nombre,
      email: updatedDoctor.email,
      telefono: updatedDoctor.telefono,
      direccion: updatedDoctor.direccion || "",
      biografia: updatedDoctor.biografia || "",
      horario: updatedDoctor.horario || "",
      imagen: updatedDoctor.imagen || "/placeholder.svg?height=200&width=200",
      especialidad: updatedDoctor.especialidad.nombre,
      id_especialidad: updatedDoctor.especialidadId,
      estado: updatedDoctor.estado,
    }

    return NextResponse.json(formattedDoctor)
  } catch (error) {
    console.error("Error al actualizar doctor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


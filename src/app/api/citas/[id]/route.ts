import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verify } from "jsonwebtoken"

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

    // Obtener cita por ID
    const cita = await prisma.cita.findUnique({
      where: { id },
      include: {
        doctor: {
          include: {
            especialidad: true,
          },
        },
      },
    })

    if (!cita) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 })
    }

    // Transformar a formato esperado por el frontend
    const formattedCita = {
      id: cita.id,
      fecha: cita.fecha,
      hora: cita.hora,
      ubicacion: cita.ubicacion,
      estado: cita.estado,
      notas: cita.notas || "",
      doctor: cita.doctor.nombre,
      especialidad: cita.doctor.especialidad.nombre,
    }

    return NextResponse.json(formattedCita)
  } catch (error) {
    console.error("Error al obtener cita:", error)
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

    // Verificar si la cita existe
    const existingCita = await prisma.cita.findUnique({
      where: { id },
    })

    if (!existingCita) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 })
    }

    // Obtener datos para actualizar
    const body = await request.json()
    const { fecha, hora, motivo, estado, notas } = body

    // Preparar datos para actualizar
    const updateData: any = {}

    if (fecha) updateData.fecha = fecha
    if (hora) updateData.hora = hora
    if (motivo) updateData.motivo = motivo
    if (estado) updateData.estado = estado
    if (notas) updateData.notas = notas

    // Actualizar la cita
    const updatedCita = await prisma.cita.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedCita)
  } catch (error) {
    console.error("Error al actualizar cita:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


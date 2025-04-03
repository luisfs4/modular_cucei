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

export async function GET(request: NextRequest) {
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

    // Obtener todas las citas
    const citas = await prisma.cita.findMany({
      include: {
        doctor: {
          include: {
            especialidad: true,
          },
        },
      },
    })

    // Transformar a formato esperado por el frontend
    const formattedCitas = citas.map((c) => ({
      id: c.id,
      fecha: c.fecha,
      hora: c.hora,
      ubicacion: c.ubicacion,
      estado: c.estado,
      notas: c.notas || "",
      doctor: c.doctor.nombre,
      especialidad: c.doctor.especialidad.nombre,
    }))

    return NextResponse.json(formattedCitas)
  } catch (error) {
    console.error("Error al obtener citas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    // Obtener datos de la cita
    const body = await request.json()
    const { id_paciente, fecha, hora, motivo, estado, id_medico, notas, duracion, ubicacion } = body

    // Crear la cita
    const cita = await prisma.cita.create({
      data: {
        fecha,
        hora,
        duracion,
        motivo,
        estado: estado || "programada",
        notas,
        ubicacion,
        pacienteId: id_paciente,
        doctorId: id_medico,
      },
    })

    return NextResponse.json(cita)
  } catch (error) {
    console.error("Error al crear cita:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


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

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const pacienteId = searchParams.get("pacienteId")
    const doctorId = searchParams.get("doctorId")

    // Construir la consulta
    const where: any = {}
    if (pacienteId) where.pacienteId = Number.parseInt(pacienteId)
    if (doctorId) where.doctorId = Number.parseInt(doctorId)

    // Obtener interpretaciones
    const interpretaciones = await prisma.interpretacion.findMany({
      where,
      orderBy: {
        fecha: "desc",
      },
      include: {
        paciente: {
          select: {
            nombre: true,
          },
        },
        doctor: {
          select: {
            nombre: true,
          },
        },
      },
    })

    return NextResponse.json(interpretaciones)
  } catch (error) {
    console.error("Error al obtener interpretaciones:", error)
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

    // Obtener datos de la interpretación
    const body = await request.json()
    const { pacienteId, doctorId, fecha, tipoEstudio, archivoUrl, parametros, resultados, observaciones, estado } = body

    // Validar datos
    if (!pacienteId || !doctorId || !fecha || !tipoEstudio) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    // Crear la interpretación
    const interpretacion = await prisma.interpretacion.create({
      data: {
        pacienteId: Number.parseInt(pacienteId),
        doctorId: Number.parseInt(doctorId),
        fecha,
        tipoEstudio,
        archivoUrl,
        parametros,
        resultados,
        observaciones,
        estado: estado || "pendiente",
      },
    })

    return NextResponse.json(interpretacion)
  } catch (error) {
    console.error("Error al crear interpretación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


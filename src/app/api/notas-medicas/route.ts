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

    // Obtener notas médicas
    const notasMedicas = await prisma.notaMedica.findMany({
      where,
      orderBy: {
        fecha: "desc",
      },
      include: {
        doctor: {
          select: {
            nombre: true,
            especialidad: true,
          },
        },
      },
    })

    return NextResponse.json(notasMedicas)
  } catch (error) {
    console.error("Error al obtener notas médicas:", error)
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

    // Obtener datos de la nota médica
    const body = await request.json()
    const { pacienteId, doctorId, fecha, contenido } = body

    // Validar datos
    if (!pacienteId || !doctorId || !fecha || !contenido) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    // Crear la nota médica
    const notaMedica = await prisma.notaMedica.create({
      data: {
        pacienteId: Number.parseInt(pacienteId),
        doctorId: Number.parseInt(doctorId),
        fecha,
        contenido,
      },
    })

    return NextResponse.json(notaMedica)
  } catch (error) {
    console.error("Error al crear nota médica:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


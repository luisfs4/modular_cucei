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

    // Obtener interpretación por ID
    const interpretacion = await prisma.interpretacion.findUnique({
      where: { id },
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

    if (!interpretacion) {
      return NextResponse.json({ error: "Interpretación no encontrada" }, { status: 404 })
    }

    return NextResponse.json(interpretacion)
  } catch (error) {
    console.error("Error al obtener interpretación:", error)
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

    // Verificar si la interpretación existe
    const existingInterpretacion = await prisma.interpretacion.findUnique({
      where: { id },
    })

    if (!existingInterpretacion) {
      return NextResponse.json({ error: "Interpretación no encontrada" }, { status: 404 })
    }

    // Obtener datos para actualizar
    const body = await request.json()
    const { parametros, resultados, observaciones, estado } = body

    // Actualizar la interpretación
    const updatedInterpretacion = await prisma.interpretacion.update({
      where: { id },
      data: {
        parametros,
        resultados,
        observaciones,
        estado,
      },
    })

    return NextResponse.json(updatedInterpretacion)
  } catch (error) {
    console.error("Error al actualizar interpretación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verificar si la interpretación existe
    const existingInterpretacion = await prisma.interpretacion.findUnique({
      where: { id },
    })

    if (!existingInterpretacion) {
      return NextResponse.json({ error: "Interpretación no encontrada" }, { status: 404 })
    }

    // Eliminar la interpretación
    await prisma.interpretacion.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar interpretación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


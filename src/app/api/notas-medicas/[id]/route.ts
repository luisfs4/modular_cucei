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

    // Obtener nota médica por ID
    const notaMedica = await prisma.notaMedica.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            nombre: true,
            especialidad: true,
          },
        },
      },
    })

    if (!notaMedica) {
      return NextResponse.json({ error: "Nota médica no encontrada" }, { status: 404 })
    }

    return NextResponse.json(notaMedica)
  } catch (error) {
    console.error("Error al obtener nota médica:", error)
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

    // Verificar si la nota médica existe
    const existingNota = await prisma.notaMedica.findUnique({
      where: { id },
    })

    if (!existingNota) {
      return NextResponse.json({ error: "Nota médica no encontrada" }, { status: 404 })
    }

    // Obtener datos para actualizar
    const body = await request.json()
    const { contenido } = body

    // Actualizar la nota médica
    const updatedNota = await prisma.notaMedica.update({
      where: { id },
      data: {
        contenido,
      },
    })

    return NextResponse.json(updatedNota)
  } catch (error) {
    console.error("Error al actualizar nota médica:", error)
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

    // Verificar si la nota médica existe
    const existingNota = await prisma.notaMedica.findUnique({
      where: { id },
    })

    if (!existingNota) {
      return NextResponse.json({ error: "Nota médica no encontrada" }, { status: 404 })
    }

    // Eliminar la nota médica
    await prisma.notaMedica.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar nota médica:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


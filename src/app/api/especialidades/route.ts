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

    // Obtener todas las especialidades
    const especialidades = await prisma.especialidad.findMany()

    // Transformar a formato esperado por el frontend
    const formattedEspecialidades = especialidades.map((e) => ({
      id: e.id,
      nombre: e.nombre,
      especialidad: e.nombre,
    }))

    return NextResponse.json(formattedEspecialidades)
  } catch (error) {
    console.error("Error al obtener especialidades:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


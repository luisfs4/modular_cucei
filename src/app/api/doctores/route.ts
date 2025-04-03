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
    const skip = Number.parseInt(searchParams.get("skip") || "0")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    // Obtener todos los doctores
    const doctores = await prisma.doctor.findMany({
      skip,
      take: limit,
      include: {
        especialidad: true,
      },
    })

    // Transformar a formato esperado por el frontend
    const formattedDoctores = doctores.map((d) => ({
      id_medico: d.id,
      telefono: d.telefono,
      estado: d.estado,
      nombre: d.nombre,
      email: d.email,
      direccion: d.direccion || "",
      biografia: d.biografia || "",
      imagen: d.imagen,
      horario: d.horario || "",
      id_especialidad: d.especialidadId,
      especialidad: d.especialidad.nombre,
    }))

    return NextResponse.json(formattedDoctores)
  } catch (error) {
    console.error("Error al obtener doctores:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


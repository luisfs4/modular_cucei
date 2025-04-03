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

    // Obtener citas por doctor
    const citas = await prisma.cita.findMany({
      where: { doctorId: id },
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
    console.error("Error al obtener citas por doctor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


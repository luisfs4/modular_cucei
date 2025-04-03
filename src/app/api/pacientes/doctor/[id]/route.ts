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

    const doctorId = Number.parseInt(params.id)

    // Vamos a simplificar la consulta para depurar
    // Primero, obtener todas las citas del doctor
    const citas = await prisma.cita.findMany({
      where: { doctorId },
      include: {
        paciente: true,
      },
    })

    // Crear un mapa para evitar duplicados
    const pacientesMap = new Map()

    // Procesar cada cita para extraer información del paciente
    for (const cita of citas) {
      if (!pacientesMap.has(cita.pacienteId)) {
        pacientesMap.set(cita.pacienteId, {
          id_paciente: cita.pacienteId,
          nombre: cita.paciente.nombre,
          edad: cita.paciente.fechaNacimiento
            ? new Date().getFullYear() - new Date(cita.paciente.fechaNacimiento).getFullYear()
            : null,
          genero: cita.paciente.genero,
          email: cita.paciente.email,
          tel: cita.paciente.telefono,
          direccion: cita.paciente.direccion,
          imagen: cita.paciente.imagen || "/placeholder.svg?height=40&width=40",
          estado: cita.paciente.estado ? "Activo" : "Inactivo",
          ultima_visita: cita.fecha,
          proxima_cita: null,
        })
      }
    }

    // Convertir el mapa a un array
    const pacientes = Array.from(pacientesMap.values())

    // Para cada paciente, buscar su próxima cita
    for (const paciente of pacientes) {
      const proximaCita = await prisma.cita.findFirst({
        where: {
          pacienteId: paciente.id_paciente,
          doctorId,
          estado: "programada",
          fecha: {
            gte: new Date().toISOString().split("T")[0], // Fecha actual o posterior
          },
        },
        orderBy: {
          fecha: "asc",
        },
      })

      if (proximaCita) {
        paciente.proxima_cita = proximaCita.fecha
      }
    }

    return NextResponse.json(pacientes)
  } catch (error) {
    console.error("Error al obtener pacientes del doctor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


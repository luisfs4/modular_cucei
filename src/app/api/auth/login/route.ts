import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

// Clave secreta para JWT (en producción, usar variables de entorno)
const JWT_SECRET = "clinica-ia-secret-key"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Buscar usuario por email
    const user = await prisma.usuario.findUnique({
      where: { email: username },
    })

    // Si no existe el usuario, buscar en doctores
    if (!user) {
      const doctor = await prisma.doctor.findUnique({
        where: { email: username },
      })

      if (!doctor) {
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
      }

      // Verificar contraseña
      const passwordValid = await compare(password, doctor.password)
      if (!passwordValid) {
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
      }

      // Generar token JWT
      const token = sign({ id: doctor.id, email: doctor.email, rol: "doctor" }, JWT_SECRET, { expiresIn: "7d" })

      return NextResponse.json({
        access_token: token,
        token_type: "bearer",
        rol: "doctor",
        id: doctor.id,
      })
    }

    // Verificar contraseña
    const passwordValid = await compare(password, user.password)
    if (!passwordValid) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Generar token JWT
    const token = sign({ id: user.id, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: "7d" })

    return NextResponse.json({
      access_token: token,
      token_type: "bearer",
      rol: user.rol,
      id: user.id,
    })
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


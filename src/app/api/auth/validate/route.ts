import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

// Clave secreta para JWT (debe coincidir con la de login)
const JWT_SECRET = "clinica-ia-secret-key"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 })
    }

    // Verificar token
    verify(token, JWT_SECRET)

    return NextResponse.json({ valid: true })
  } catch (error) {
    return NextResponse.json({ valid: false })
  }
}


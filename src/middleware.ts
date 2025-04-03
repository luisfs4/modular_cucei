import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

// Clave secreta para JWT
const JWT_SECRET = "clinica-ia-secret-key"

// Rutas que no requieren autenticación
const publicRoutes = ["/api/auth/login", "/api/auth/validate", "/api/seed", "/login", "/"]

export function middleware(request: NextRequest) {
  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Verificar si es una ruta de API
  const isApiRoute = request.nextUrl.pathname.startsWith("/api")

  if (isApiRoute) {
    // Verificar si tiene token de autorización
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    try {
      // Verificar token
      verify(token, JWT_SECRET)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }
  }

  // Para rutas de cliente protegidas, redirigir a login
  const token = request.cookies.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verificar token
    verify(token, JWT_SECRET)
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

// Configurar las rutas que deben usar el middleware
export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/doctor/:path*", "/paciente/:path*"],
}


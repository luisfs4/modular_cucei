import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
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

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    // Validar tipo de archivo (PDF o imagen)
    const fileType = file.type
    if (!fileType.startsWith("image/") && fileType !== "application/pdf") {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo se aceptan imágenes o PDF." },
        { status: 400 },
      )
    }

    // Generar un nombre único para el archivo
    const fileName = `interpretacion-${Date.now()}-${file.name}`

    // Subir archivo a Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      contentType: fileType,
    })
  } catch (error) {
    console.error("Error al subir archivo:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


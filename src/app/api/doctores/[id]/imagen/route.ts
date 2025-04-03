import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verify } from "jsonwebtoken"
import { put } from "@vercel/blob"

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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verificar si el doctor existe
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id },
    })

    if (!existingDoctor) {
      return NextResponse.json({ error: "Doctor no encontrado" }, { status: 404 })
    }

    // Procesar la imagen
    const formData = await request.formData()
    const file = formData.get("imagen") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ninguna imagen" }, { status: 400 })
    }

    // Subir la imagen a Vercel Blob
    try {
      const blob = await put(`doctores/${id}/profile-${Date.now()}.${file.name.split(".").pop()}`, file, {
        access: "public",
      })

      // Actualizar la URL de la imagen en la base de datos
      const updatedDoctor = await prisma.doctor.update({
        where: { id },
        data: {
          imagen: blob.url,
        },
      })

      return NextResponse.json({
        success: true,
        imagen: blob.url,
      })
    } catch (error) {
      console.error("Error al subir la imagen a Vercel Blob:", error)

      // Si falla la subida a Vercel Blob, usamos una URL de placeholder como fallback
      const fallbackImageUrl = `/placeholder.svg?height=200&width=200&text=Doctor_${id}_${Date.now()}`

      // Actualizar con la URL de fallback
      const updatedDoctor = await prisma.doctor.update({
        where: { id },
        data: {
          imagen: fallbackImageUrl,
        },
      })

      return NextResponse.json({
        success: true,
        imagen: fallbackImageUrl,
        warning: "Se usó una imagen de respaldo debido a un error en el servicio de almacenamiento",
      })
    }
  } catch (error) {
    console.error("Error al actualizar imagen:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}


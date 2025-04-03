"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface UploadImageProps {
  currentImage: string
  onImageChange: (file: File) => Promise<void>
  isUploading: boolean
}

export function UploadImage({ currentImage, onImageChange, isUploading }: UploadImageProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Efecto para limpiar las URLs de objeto cuando el componente se desmonte
  useEffect(() => {
    return () => {
      // Limpiar la URL de previsualización cuando el componente se desmonte
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Efecto para actualizar la previsualización cuando cambia la imagen actual
  useEffect(() => {
    if (!previewUrl && currentImage) {
      setPreviewUrl(null)
    }
  }, [currentImage, previewUrl])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar el tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen válido.")
      return
    }

    // Validar el tamaño del archivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es demasiado grande. El tamaño máximo permitido es 5MB.")
      return
    }

    // Limpiar la URL anterior si existe
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    // Crear una URL para previsualizar la imagen
    const fileUrl = URL.createObjectURL(file)
    setPreviewUrl(fileUrl)

    try {
      // Llamar a la función para subir la imagen
      await onImageChange(file)
      // No limpiamos la previsualización aquí para evitar parpadeos
    } catch (error) {
      console.error("Error al subir la imagen:", error)
      // En caso de error, podríamos mostrar un mensaje
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Usar la URL de previsualización si existe, de lo contrario usar la imagen actual
  const displayImage = previewUrl || currentImage || "/placeholder.svg?height=200&width=200"

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-40 h-40">
        <Image
          src={displayImage || "/placeholder.svg"}
          alt="Imagen de perfil"
          fill
          className="rounded-full object-cover border-4 border-background transition-opacity duration-300"
        />
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <Button variant="outline" size="sm" onClick={triggerFileInput} disabled={isUploading}>
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            Cambiar foto
          </>
        )}
      </Button>
    </div>
  )
}


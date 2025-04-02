import { API_URL, getAuthHeaders, handleApiError } from "@/lib/api-config"

export const iaService = {
  // Subir un archivo para procesamiento IA
  async uploadFile(file: File, token: string): Promise<any> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_URL}/ia/paciente/archivo/`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    })

    await handleApiError(response)
    return response.json()
  },

  // Obtener un archivo procesado
  async getFile(fileId: number, token: string): Promise<any> {
    const response = await fetch(`${API_URL}/ia/paciente/archivo/${fileId}`, {
      headers: getAuthHeaders(token),
    })

    await handleApiError(response)
    return response.json()
  },
}


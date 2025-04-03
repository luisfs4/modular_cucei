// Función para manejar errores de fetch
export async function handleFetchError(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Error: ${response.status}`)
    }
    return response
  }
  
  // Función para realizar peticiones GET con token
  export async function fetchWithAuth(url: string, token: string) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  
    return handleFetchError(response)
  }
  
  // Función para realizar peticiones POST con token
  export async function postWithAuth(url: string, data: any, token: string) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  
    return handleFetchError(response)
  }
  
  // Función para realizar peticiones PUT con token
  export async function putWithAuth(url: string, data: any, token: string) {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  
    return handleFetchError(response)
  }
  
  // Función para realizar peticiones DELETE con token
  export async function deleteWithAuth(url: string, token: string) {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  
    return handleFetchError(response)
  }
  
  
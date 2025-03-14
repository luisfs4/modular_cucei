// Definición de endpoints para la API

// Base URL
export const API_BASE_URL = "/api"

// Autenticación
export const AUTH_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  logout: `${API_BASE_URL}/auth/logout`,
  perfil: `${API_BASE_URL}/auth/perfil`,
}

// Doctores
export const DOCTORES_ENDPOINTS = {
  listar: `${API_BASE_URL}/doctores`,
  obtener: (id: number) => `${API_BASE_URL}/doctores/${id}`,
  crear: `${API_BASE_URL}/doctores`,
  actualizar: (id: number) => `${API_BASE_URL}/doctores/${id}`,
  eliminar: (id: number) => `${API_BASE_URL}/doctores/${id}`,
}

// Usuarios/Pacientes
export const USUARIOS_ENDPOINTS = {
  listar: `${API_BASE_URL}/usuarios`,
  obtener: (id: number) => `${API_BASE_URL}/usuarios/${id}`,
  crear: `${API_BASE_URL}/usuarios`,
  actualizar: (id: number) => `${API_BASE_URL}/usuarios/${id}`,
  eliminar: (id: number) => `${API_BASE_URL}/usuarios/${id}`,
}

// Citas
export const CITAS_ENDPOINTS = {
  listar: `${API_BASE_URL}/citas`,
  obtener: (id: number) => `${API_BASE_URL}/citas/${id}`,
  crear: `${API_BASE_URL}/citas`,
  actualizar: (id: number) => `${API_BASE_URL}/citas/${id}`,
  eliminar: (id: number) => `${API_BASE_URL}/citas/${id}`,
  porDoctor: (doctorId: number) => `${API_BASE_URL}/citas/doctor/${doctorId}`,
  porPaciente: (pacienteId: number) => `${API_BASE_URL}/citas/paciente/${pacienteId}`,
}


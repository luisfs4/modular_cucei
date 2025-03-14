// Tipos para las respuestas de la API

// Doctor
export interface Doctor {
  id: number
  nombre: string
  especialidad: string
  email: string
  telefono: string
  direccion?: string
  biografia?: string
  horario?: string
  estado: "Activo" | "Inactivo"
  imagen?: string
}

export interface DoctorResponse {
  doctor: Doctor
}

export interface DoctoresResponse {
  doctores: Doctor[]
  total: number
}

// Usuario/Paciente
export interface Usuario {
  id: number
  nombre: string
  email: string
  telefono: string
  direccion?: string
  fechaNacimiento?: string
  genero?: string
  estado: "Activo" | "Inactivo"
  ultimaVisita?: string
  imagen?: string
}

export interface UsuarioResponse {
  usuario: Usuario
}

export interface UsuariosResponse {
  usuarios: Usuario[]
  total: number
}

// Cita
export interface Cita {
  id: number
  pacienteId: number
  doctorId: number
  fecha: string
  hora: string
  duracion: number
  motivo?: string
  estado: "Programada" | "Completada" | "Cancelada"
  notas?: string
  // Datos relacionados
  paciente?: Usuario
  doctor?: Doctor
}

export interface CitaResponse {
  cita: Cita
}

export interface CitasResponse {
  citas: Cita[]
  total: number
}

// Autenticación
export interface LoginRequest {
  email: string
  password: string
  tipo: "doctor" | "paciente"
}

export interface LoginResponse {
  token: string
  usuario: Usuario | Doctor
  tipo: "doctor" | "paciente"
}

// Respuesta genérica para operaciones CRUD
export interface ApiResponse {
  success: boolean
  message: string
  data?: any
}


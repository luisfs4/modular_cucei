// This file defines routes that should be rendered dynamically (not statically)
export const dynamicRoutes = [
    "/login",
    "/admin",
    "/admin/doctores",
    "/admin/doctores/nuevo",
    "/admin/usuarios",
    "/admin/usuarios/nuevo",
    "/doctor/calendario",
    "/doctor/pacientes",
    "/doctor/perfil",
    "/paciente/citas/nueva",
    "/paciente/expediente",
    "/paciente/perfil",
  ]
  
  // Helper function to check if a route should be dynamic
  export function isDynamicRoute(path: string): boolean {
    return dynamicRoutes.some((route) => path.startsWith(route))
  } 
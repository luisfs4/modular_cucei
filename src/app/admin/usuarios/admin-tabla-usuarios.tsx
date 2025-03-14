"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Edit, MoreHorizontal, Search, Trash2, UserPlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Datos de ejemplo para usuarios
const usuariosMock = [
  {
    id: 1,
    nombre: "Ana López",
    email: "ana.lopez@email.com",
    telefono: "555-111-2222",
    estado: "Activo",
    ultimaVisita: "12/05/2023",
    imagen: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    nombre: "Pedro Ramírez",
    email: "pedro.ramirez@email.com",
    telefono: "555-222-3333",
    estado: "Activo",
    ultimaVisita: "05/06/2023",
    imagen: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    nombre: "Sofía Torres",
    email: "sofia.torres@email.com",
    telefono: "555-333-4444",
    estado: "Inactivo",
    ultimaVisita: "20/03/2023",
    imagen: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    nombre: "Miguel Hernández",
    email: "miguel.hernandez@email.com",
    telefono: "555-444-5555",
    estado: "Activo",
    ultimaVisita: "15/07/2023",
    imagen: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    nombre: "Laura Díaz",
    email: "laura.diaz@email.com",
    telefono: "555-555-6666",
    estado: "Activo",
    ultimaVisita: "02/08/2023",
    imagen: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminTablaUsuarios() {
  const [usuarios, setUsuarios] = useState(usuariosMock)
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<number | null>(null)
  const [dialogoEliminarAbierto, setDialogoEliminarAbierto] = useState(false)

  const elementosPorPagina = 4

  // Filtrar usuarios por búsqueda
  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.telefono.includes(busqueda),
  )

  // Calcular índices para paginación
  const indiceInicial = (paginaActual - 1) * elementosPorPagina
  const indiceFinal = indiceInicial + elementosPorPagina
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicial, indiceFinal)
  const totalPaginas = Math.ceil(usuariosFiltrados.length / elementosPorPagina)

  // Función para eliminar usuario
  const eliminarUsuario = (id: number) => {
    setUsuarios(usuarios.filter((usuario) => usuario.id !== id))
    setDialogoEliminarAbierto(false)
  }

  // Función para confirmar eliminación
  const confirmarEliminar = (id: number) => {
    setUsuarioAEliminar(id)
    setDialogoEliminarAbierto(true)
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuarios..."
            className="pl-8"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link href="/admin/usuarios/nuevo">
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Teléfono</TableHead>
                <TableHead className="hidden md:table-cell">Última Visita</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosPaginados.length > 0 ? (
                usuariosPaginados.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Image
                          src={usuario.imagen || "/placeholder.svg"}
                          alt={usuario.nombre}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <p>{usuario.nombre}</p>
                          <p className="text-sm text-muted-foreground md:hidden">{usuario.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{usuario.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{usuario.telefono}</TableCell>
                    <TableCell className="hidden md:table-cell">{usuario.ultimaVisita}</TableCell>
                    <TableCell>
                      <Badge variant={usuario.estado === "Activo" ? "default" : "secondary"}>{usuario.estado}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/usuarios/editar/${usuario.id}`} className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => confirmarEliminar(usuario.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginación */}
      {usuariosFiltrados.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {indiceInicial + 1} a {Math.min(indiceFinal, usuariosFiltrados.length)} de{" "}
            {usuariosFiltrados.length} usuarios
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={dialogoEliminarAbierto} onOpenChange={setDialogoEliminarAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoEliminarAbierto(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => usuarioAEliminar && eliminarUsuario(usuarioAEliminar)}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


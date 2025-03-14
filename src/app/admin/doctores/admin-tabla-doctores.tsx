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

// Datos de ejemplo para doctores
const doctoresMock = [
  {
    id: 1,
    nombre: "Dr. Juan Pérez",
    especialidad: "Cardiología",
    email: "juan.perez@clinica.com",
    telefono: "555-123-4567",
    estado: "Activo",
    imagen: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    nombre: "Dra. María González",
    especialidad: "Neurología",
    email: "maria.gonzalez@clinica.com",
    telefono: "555-234-5678",
    estado: "Activo",
    imagen: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    nombre: "Dr. Carlos Rodríguez",
    especialidad: "Pediatría",
    email: "carlos.rodriguez@clinica.com",
    telefono: "555-345-6789",
    estado: "Inactivo",
    imagen: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    nombre: "Dra. Ana Martínez",
    especialidad: "Dermatología",
    email: "ana.martinez@clinica.com",
    telefono: "555-456-7890",
    estado: "Activo",
    imagen: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    nombre: "Dr. Roberto Sánchez",
    especialidad: "Oftalmología",
    email: "roberto.sanchez@clinica.com",
    telefono: "555-567-8901",
    estado: "Activo",
    imagen: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminTablaDoctores() {
  const [doctores, setDoctores] = useState(doctoresMock)
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [doctorAEliminar, setDoctorAEliminar] = useState<number | null>(null)
  const [dialogoEliminarAbierto, setDialogoEliminarAbierto] = useState(false)

  const elementosPorPagina = 4

  // Filtrar doctores por búsqueda
  const doctoresFiltrados = doctores.filter(
    (doctor) =>
      doctor.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      doctor.especialidad.toLowerCase().includes(busqueda.toLowerCase()) ||
      doctor.email.toLowerCase().includes(busqueda.toLowerCase()),
  )

  // Calcular índices para paginación
  const indiceInicial = (paginaActual - 1) * elementosPorPagina
  const indiceFinal = indiceInicial + elementosPorPagina
  const doctoresPaginados = doctoresFiltrados.slice(indiceInicial, indiceFinal)
  const totalPaginas = Math.ceil(doctoresFiltrados.length / elementosPorPagina)

  // Función para eliminar doctor
  const eliminarDoctor = (id: number) => {
    setDoctores(doctores.filter((doctor) => doctor.id !== id))
    setDialogoEliminarAbierto(false)
  }

  // Función para confirmar eliminación
  const confirmarEliminar = (id: number) => {
    setDoctorAEliminar(id)
    setDialogoEliminarAbierto(true)
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar doctores..."
            className="pl-8"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link href="/admin/doctores/nuevo">
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Doctor
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead className="hidden md:table-cell">Especialidad</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctoresPaginados.length > 0 ? (
                doctoresPaginados.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Image
                          src={doctor.imagen || "/placeholder.svg"}
                          alt={doctor.nombre}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <p>{doctor.nombre}</p>
                          <p className="text-sm text-muted-foreground md:hidden">{doctor.especialidad}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{doctor.especialidad}</TableCell>
                    <TableCell className="hidden md:table-cell">{doctor.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{doctor.telefono}</TableCell>
                    <TableCell>
                      <Badge variant={doctor.estado === "Activo" ? "default" : "secondary"}>{doctor.estado}</Badge>
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
                            <Link href={`/admin/doctores/editar/${doctor.id}`} className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => confirmarEliminar(doctor.id)}
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
                    No se encontraron doctores
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginación */}
      {doctoresFiltrados.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {indiceInicial + 1} a {Math.min(indiceFinal, doctoresFiltrados.length)} de{" "}
            {doctoresFiltrados.length} doctores
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
              ¿Estás seguro de que deseas eliminar este doctor? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoEliminarAbierto(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => doctorAEliminar && eliminarDoctor(doctorAEliminar)}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


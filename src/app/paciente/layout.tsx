import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Building, Calendar, ChevronDown, ClipboardList, LogOut, Menu, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export const metadata: Metadata = {
  title: "Portal del Paciente | Clínica IA",
  description: "Portal para pacientes de la clínica",
}

export default function PacienteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // En un caso real, aquí verificaríamos si el usuario está autenticado y es paciente
  // const isAuthenticated = false;
  // if (!isAuthenticated) redirect('/login');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Building className="h-6 w-6" />
            <span>Clínica IA</span>
          </Link>
          <Link href="/paciente/expediente" className="text-muted-foreground transition-colors hover:text-foreground">
            Mi Expediente
          </Link>
          <Link href="/paciente/citas/nueva" className="text-muted-foreground transition-colors hover:text-foreground">
            Agendar Cita
          </Link>
          <Link href="/paciente/perfil" className="text-muted-foreground transition-colors hover:text-foreground">
            Mi Perfil
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Building className="h-6 w-6" />
                <span>Clínica IA</span>
              </Link>
              <Link
                href="/paciente/expediente"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Mi Expediente
              </Link>
              <Link
                href="/paciente/citas/nueva"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Agendar Cita
              </Link>
              <Link href="/paciente/perfil" className="text-muted-foreground transition-colors hover:text-foreground">
                Mi Perfil
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-end gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                Ana López
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/paciente/perfil" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Mi Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/paciente/expediente" className="cursor-pointer">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Mi Expediente
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/paciente/citas/nueva" className="cursor-pointer">
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Cita
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login" className="cursor-pointer text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}


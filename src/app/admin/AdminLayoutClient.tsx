"use client"

import type React from "react"
import Link from "next/link"
import { Building, ChevronDown, LogOut, Menu, Settings } from "lucide-react"

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
import { PageTransition } from "@/components/transitions/page-transition"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/use-auth"

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 md:px-6">
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Building className="h-6 w-6" />
              <span>Clínica IA</span>
            </Link>
            <Link href="/admin" className="text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/admin/doctores" className="text-muted-foreground transition-colors hover:text-foreground">
              Doctores
            </Link>
            <Link href="/admin/usuarios" className="text-muted-foreground transition-colors hover:text-foreground">
              Usuarios
            </Link>
            <Link href="/admin/configuracion" className="text-muted-foreground transition-colors hover:text-foreground">
              Configuración
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
                <Link href="/admin" className="text-muted-foreground transition-colors hover:text-foreground">
                  Dashboard
                </Link>
                <Link href="/admin/doctores" className="text-muted-foreground transition-colors hover:text-foreground">
                  Doctores
                </Link>
                <Link href="/admin/usuarios" className="text-muted-foreground transition-colors hover:text-foreground">
                  Usuarios
                </Link>
                <Link
                  href="/admin/configuracion"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Configuración
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex flex-1 items-center justify-end gap-4">
            <AdminUserMenu />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </ProtectedRoute>
  )
}

function AdminUserMenu() {
  const { user, logout } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          {user?.rol === "admin" ? "Administrador" : "Admin"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin/perfil" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


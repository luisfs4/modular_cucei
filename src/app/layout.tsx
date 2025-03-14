import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { NavigationProgressBar } from "@/components/transitions/progress-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clínica IA",
  description: "Plataforma de gestión para clínicas médicas",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <NavigationProgressBar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}


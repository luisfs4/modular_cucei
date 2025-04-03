import { PrismaClient } from "@prisma/client"

// PrismaClient es adjuntado al objeto global en desarrollo para prevenir
// múltiples instancias del cliente Prisma en desarrollo
declare global {
  var prisma: PrismaClient | undefined
}

const client = global.prisma || new PrismaClient()

export const prisma = client

if (process.env.NODE_ENV !== "production") global.prisma = client


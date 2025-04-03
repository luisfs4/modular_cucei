const { PrismaClient } = require("@prisma/client")
const { hash } = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("Iniciando seed...")

  // Crear especialidades
  const especialidades = [
    { nombre: "Cardiología" },
    { nombre: "Dermatología" },
    { nombre: "Neurología" },
    { nombre: "Oftalmología" },
    { nombre: "Pediatría" },
    { nombre: "Psiquiatría" },
  ]

  for (const especialidad of especialidades) {
    await prisma.especialidad.upsert({
      where: { nombre: especialidad.nombre },
      update: {},
      create: especialidad,
    })
  }

  console.log("Especialidades creadas")

  // Crear admin
  const adminPassword = await hash("admin123", 10)
  await prisma.usuario.upsert({
    where: { email: "admin@clinica.com" },
    update: {},
    create: {
      nombre: "Administrador",
      email: "admin@clinica.com",
      password: adminPassword,
      rol: "admin",
      estado: true,
    },
  })

  console.log("Admin creado")

  // Crear doctores
  const doctoresData = [
    {
      nombre: "Dr. Juan Pérez",
      email: "juan.perez@clinica.com",
      password: await hash("doctor123", 10),
      telefono: "555-123-4567",
      direccion: "Av. Principal 123, Ciudad",
      biografia:
        "Cardiólogo con más de 15 años de experiencia. Especializado en cardiología intervencionista y enfermedades cardiovasculares.",
      horario: "Lunes a Viernes: 9:00 AM - 6:00 PM",
      imagen: "/placeholder.svg?height=200&width=200",
      especialidadId: 1, // Cardiología
    },
    {
      nombre: "Dra. María González",
      email: "maria.gonzalez@clinica.com",
      password: await hash("doctor123", 10),
      telefono: "555-234-5678",
      direccion: "Calle Secundaria 456, Ciudad",
      biografia: "Neuróloga especializada en trastornos del sueño y enfermedades neurodegenerativas.",
      horario: "Lunes a Jueves: 8:00 AM - 5:00 PM",
      imagen: "/placeholder.svg?height=200&width=200",
      especialidadId: 3, // Neurología
    },
    {
      nombre: "Dr. Carlos Rodríguez",
      email: "carlos.rodriguez@clinica.com",
      password: await hash("doctor123", 10),
      telefono: "555-345-6789",
      direccion: "Plaza Central 789, Ciudad",
      biografia: "Pediatra con enfoque en desarrollo infantil y medicina preventiva.",
      horario: "Martes a Sábado: 9:00 AM - 4:00 PM",
      imagen: "/placeholder.svg?height=200&width=200",
      especialidadId: 5, // Pediatría
    },
  ]

  for (const doctor of doctoresData) {
    await prisma.doctor.upsert({
      where: { email: doctor.email },
      update: {},
      create: doctor,
    })
  }

  console.log("Doctores creados")

  // Crear pacientes
  const pacientesData = [
    {
      nombre: "Ana López",
      email: "ana.lopez@email.com",
      password: await hash("paciente123", 10),
      telefono: "555-111-2222",
      direccion: "Calle Principal 123, Ciudad",
      fechaNacimiento: "1988-05-15",
      genero: "Femenino",
      imagen: "/placeholder.svg?height=200&width=200",
      rol: "paciente",
    },
    {
      nombre: "Pedro Ramírez",
      email: "pedro.ramirez@email.com",
      password: await hash("paciente123", 10),
      telefono: "555-222-3333",
      direccion: "Avenida Central 456, Ciudad",
      fechaNacimiento: "1975-10-20",
      genero: "Masculino",
      imagen: "/placeholder.svg?height=200&width=200",
      rol: "paciente",
    },
    {
      nombre: "Sofía Torres",
      email: "sofia.torres@email.com",
      password: await hash("paciente123", 10),
      telefono: "555-333-4444",
      direccion: "Boulevard Norte 789, Ciudad",
      fechaNacimiento: "1995-03-25",
      genero: "Femenino",
      imagen: "/placeholder.svg?height=200&width=200",
      rol: "paciente",
    },
  ]

  for (const paciente of pacientesData) {
    await prisma.usuario.upsert({
      where: { email: paciente.email },
      update: {},
      create: paciente,
    })
  }

  console.log("Pacientes creados")

  // Crear citas
  const hoy = new Date()
  const manana = new Date(hoy)
  manana.setDate(hoy.getDate() + 1)
  const pasadoManana = new Date(hoy)
  pasadoManana.setDate(hoy.getDate() + 2)
  const ayer = new Date(hoy)
  ayer.setDate(hoy.getDate() - 1)
  const anteayer = new Date(hoy)
  anteayer.setDate(hoy.getDate() - 2)

  // Limpiar citas existentes para evitar duplicados
  try {
    await prisma.cita.deleteMany({})
    console.log("Citas anteriores eliminadas")
  } catch (error) {
    console.log("No se pudieron eliminar las citas anteriores:", error)
  }

  const citasData = [
    {
      fecha: ayer.toISOString().split("T")[0],
      hora: "10:00",
      duracion: 30,
      motivo: "Consulta de rutina",
      estado: "completada",
      notas: "Paciente con presión arterial normal. Se recomienda seguimiento en 6 meses.",
      ubicacion: "Consultorio 101",
      pacienteId: 1, // Ana López
      doctorId: 1, // Dr. Juan Pérez
    },
    {
      fecha: hoy.toISOString().split("T")[0],
      hora: "15:30",
      duracion: 30,
      motivo: "Dolor de cabeza recurrente",
      estado: "programada",
      ubicacion: "Consultorio 203",
      pacienteId: 2, // Pedro Ramírez
      doctorId: 2, // Dra. María González
    },
    {
      fecha: manana.toISOString().split("T")[0],
      hora: "09:00",
      duracion: 45,
      motivo: "Control pediátrico",
      estado: "programada",
      ubicacion: "Consultorio 305",
      pacienteId: 3, // Sofía Torres
      doctorId: 3, // Dr. Carlos Rodríguez
    },
    {
      fecha: anteayer.toISOString().split("T")[0],
      hora: "11:30",
      duracion: 30,
      motivo: "Revisión de exámenes",
      estado: "cancelada",
      notas: "Paciente canceló por motivos personales.",
      ubicacion: "Consultorio 101",
      pacienteId: 2, // Pedro Ramírez
      doctorId: 1, // Dr. Juan Pérez
    },
    {
      fecha: pasadoManana.toISOString().split("T")[0],
      hora: "16:00",
      duracion: 30,
      motivo: "Seguimiento de tratamiento",
      estado: "programada",
      ubicacion: "Consultorio 203",
      pacienteId: 1, // Ana López
      doctorId: 2, // Dra. María González
    },
  ]

  for (const cita of citasData) {
    await prisma.cita.create({
      data: cita,
    })
  }

  console.log("Citas creadas")
  console.log("Seed completado")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


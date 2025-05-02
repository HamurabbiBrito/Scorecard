const { PrismaClient } = require('@prisma/client')

// Configuración de logging
const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'warn', 'error']
    : ['warn', 'error']
})

// Singleton para evitar múltiples instancias en desarrollo
const globalPrisma = global.prisma || prismaClient

if (process.env.NODE_ENV === 'development') {
  global.prisma = globalPrisma
}

// Manejo de conexión/desconexión
const connect = async () => {
  if (process.env.NODE_ENV === 'production') {
    await globalPrisma.$connect()
  }
}

const disconnect = async () => {
  if (process.env.NODE_ENV === 'production') {
    await globalPrisma.$disconnect()
  }
}

// Eventos de limpieza
process.on('beforeExit', async () => {
  await disconnect()
})

process.on('SIGINT', async () => {
  await disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await disconnect()
  process.exit(0)
})

module.exports =globalPrisma
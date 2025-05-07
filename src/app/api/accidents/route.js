import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateAccidentReport, validatePartialAccidentReport } from '@/validations/accidentReports'

// Configuración reusable de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Helpers (se mantienen igual)
const errorResponse = (message, status = 400) => {
  return NextResponse.json(
    { error: message },
    { status, headers: corsHeaders }
  )
}

const successResponse = (data, status = 200) => {
  return NextResponse.json(data, { status, headers: corsHeaders })
}

// POST - Crear nuevo reporte (existente)
export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return errorResponse('Formato de contenido no válido', 415)
    }

    const data = await request.json()
    
    const validation = validateAccidentReport(data)
    if (!validation.success) {
      return errorResponse(validation.errors, 400)
    }

    const newReport = await prisma.$transaction(async (tx) => {
      const report = await tx.accidentReport.create({
        data: {
          fecha: new Date(data.fecha),
          areaId: Number(data.areaId),
          cantidadAccidentes: Number(data.cantidadAccidentes),
          cantidadCuasiAccidentes: Number(data.cantidadCuasiAccidentes),
          diasUltimoAccidente: Number(data.diasUltimoAccidente),
        },
        include: { area: true }
      })

      await tx.area.update({
        where: { id: Number(data.areaId) },
        data: { lastAccidentDate: new Date(data.fecha) }
      })

      return report
    })

    return successResponse(newReport, 201)

  } catch (error) {
    console.error('Error POST /api/accidents:', error)
    return errorResponse('Error interno del servidor', 500)
  }
}

// GET - Obtener reportes (existente)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const areaId = searchParams.get('areaId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (isNaN(page) || isNaN(limit)) {
      return errorResponse('Parámetros de paginación inválidos', 400)
    }

    const whereClause = areaId && !isNaN(areaId) 
      ? { areaId: Number(areaId) } 
      : {}

    const [reports, total] = await prisma.$transaction([
      prisma.accidentReport.findMany({
        where: whereClause,
        include: { area: true },
        orderBy: { fecha: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.accidentReport.count({ where: whereClause })
    ])

    return successResponse({
      data: reports,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error GET /api/accidents:', error)
    return errorResponse('Error al obtener datos', 500)
  }
}

// PUT - Actualizar reporte existente (nuevo)
export async function PUT(request) {
  try {
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return errorResponse('Formato de contenido no válido', 415)
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id || isNaN(id)) {
      return errorResponse('ID de reporte no válido', 400)
    }

    const data = await request.json()
    
    const validation = validateAccidentReport(data)
    if (!validation.success) {
      return errorResponse(validation.errors, 400)
    }

    const updatedReport = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el reporte
      const report = await tx.accidentReport.update({
        where: { id: Number(id) },
        data: {
          fecha: new Date(data.fecha),
          areaId: Number(data.areaId),
          cantidadAccidentes: Number(data.cantidadAccidentes),
          cantidadCuasiAccidentes: Number(data.cantidadCuasiAccidentes),
          diasUltimoAccidente: Number(data.diasUltimoAccidente),
        },
        include: { area: true }
      })

      // 2. Actualizar última fecha de accidente en el área si cambió
      if (new Date(data.fecha) > new Date(report.area.lastAccidentDate || 0)) {
        await tx.area.update({
          where: { id: Number(data.areaId) },
          data: { lastAccidentDate: new Date(data.fecha) }
        })
      }

      return report
    })

    return successResponse(updatedReport)

  } catch (error) {
    console.error('Error PUT /api/accidents:', error)
    
    // Manejo específico para registro no encontrado
    if (error.code === 'P2025') {
      return errorResponse('Reporte no encontrado', 404)
    }
    
    return errorResponse('Error interno del servidor', 500)
  }
}

// DELETE - Eliminar reporte (nuevo)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id || isNaN(id)) {
      return errorResponse('ID de reporte no válido', 400)
    }

    // Transacción para mantener consistencia
    const result = await prisma.$transaction(async (tx) => {
      // 1. Obtener el reporte antes de eliminar
      const report = await tx.accidentReport.findUnique({
        where: { id: Number(id) },
        include: { area: true }
      })

      if (!report) {
        throw { code: 'P2025' } // Simular error de Prisma
      }

      // 2. Eliminar el reporte
      await tx.accidentReport.delete({
        where: { id: Number(id) }
      })

      // 3. Verificar si era el último accidente del área
      const lastAccident = await tx.accidentReport.findFirst({
        where: { areaId: report.areaId },
        orderBy: { fecha: 'desc' },
        select: { fecha: true }
      })

      // 4. Actualizar última fecha del área
      await tx.area.update({
        where: { id: report.areaId },
        data: { 
          lastAccidentDate: lastAccident?.fecha || null 
        }
      })

      return { success: true }
    })

    return successResponse({ message: 'Reporte eliminado correctamente' })

  } catch (error) {
    console.error('Error DELETE /api/accidents:', error)
    
    if (error.code === 'P2025') {
      return errorResponse('Reporte no encontrado', 404)
    }
    
    return errorResponse('Error interno al eliminar reporte', 500)
  }
}

// NUEVO MÉTODO PATCH para edición directa
export async function PATCH(request) {
  try {
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return errorResponse('Formato de contenido no válido', 415)
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id || isNaN(id)) {
      return errorResponse('ID de reporte no válido', 400)
    }

    const data = await request.json()
    
    // Validación parcial (solo campos presentes)
    const validation = validatePartialAccidentReport(data);
    if (!validation.success) {
      return errorResponse(validation.errors, 400);
    }

    // Preparar updates
    const updates = {}
    if (data.fecha !== undefined) updates.fecha = new Date(data.fecha)
    if (data.areaId !== undefined) updates.areaId = Number(data.areaId)
    if (data.cantidadAccidentes !== undefined) updates.cantidadAccidentes = Number(data.cantidadAccidentes)
    if (data.cantidadCuasiAccidentes !== undefined) updates.cantidadCuasiAccidentes = Number(data.cantidadCuasiAccidentes)
    if (data.diasUltimoAccidente !== undefined) updates.diasUltimoAccidente = Number(data.diasUltimoAccidente)

    const updatedReport = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el reporte
      const report = await tx.accidentReport.update({
        where: { id: Number(id) },
        data: updates,
        include: { area: true }
      })

      // 2. Si se actualizó la fecha, verificar si es la más reciente
      if (data.fecha !== undefined) {
        const latestAccident = await tx.accidentReport.findFirst({
          where: { areaId: report.areaId },
          orderBy: { fecha: 'desc' },
          select: { fecha: true }
        })

        if (latestAccident && new Date(latestAccident.fecha).getTime() === new Date(data.fecha).getTime()) {
          await tx.area.update({
            where: { id: report.areaId },
            data: { lastAccidentDate: new Date(data.fecha) }
          })
        }
      }

      return report
    })

    return successResponse(updatedReport)

  } catch (error) {
    console.error('Error PATCH /api/accidents:', error)
    
    if (error.code === 'P2025') {
      return errorResponse('Reporte no encontrado', 404)
    }
    
    return errorResponse('Error interno del servidor', 500)
  }
}

// Los demás métodos (POST, GET, PUT, DELETE, OPTIONS) se mantienen exactamente igual como los tienes...
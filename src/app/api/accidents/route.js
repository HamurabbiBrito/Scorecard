import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateAccidentReport, validatePartialAccidentReport } from '@/validations/accidentReports'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const errorResponse = (message, status = 400) => {
  return NextResponse.json(
    { error: message },
    { status, headers: corsHeaders }
  )
}

const successResponse = (data, status = 200) => {
  return NextResponse.json(data, { status, headers: corsHeaders })
}

const calculateDaysSinceLast = async (areaId, beforeDate = null) => {
  const where = { areaId: Number(areaId) }
  if (beforeDate) where.fecha = { lt: new Date(beforeDate) }

  const lastAccident = await prisma.accidentReport.findFirst({
    where,
    orderBy: { fecha: 'desc' },
    select: { fecha: true }
  })

  if (!lastAccident) return 0

  const referenceDate = beforeDate ? new Date(beforeDate) : new Date()
  const lastDate = new Date(lastAccident.fecha)
  return Math.floor((referenceDate - lastDate) / (1000 * 60 * 60 * 24))
}

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

    const diasUltimoAccidente = await calculateDaysSinceLast(data.areaId, data.fecha)

    const newReport = await prisma.$transaction(async (tx) => {
      const report = await tx.accidentReport.create({
        data: {
          fecha: new Date(data.fecha),
          areaId: Number(data.areaId),
          cantidadAccidentes: Number(data.cantidadAccidentes),
          cantidadCuasiAccidentes: Number(data.cantidadCuasiAccidentes),
          diasUltimoAccidente,
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const areaId = searchParams.get('areaId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const lastOnly = searchParams.get('last') === 'true'
    const beforeDate = searchParams.get('beforeDate')

    if (lastOnly && areaId) {
      const daysSinceLast = await calculateDaysSinceLast(areaId)
      return successResponse({ daysSinceLast })
    }

    if (beforeDate && areaId) {
      const daysSinceLast = await calculateDaysSinceLast(areaId, beforeDate)
      return successResponse({ daysSinceLast })
    }

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
    
    const validation = validatePartialAccidentReport(data)
    if (!validation.success) {
      return errorResponse(validation.errors, 400)
    }

    const currentReport = await prisma.accidentReport.findUnique({
      where: { id: Number(id) },
      select: { fecha: true, areaId: true }
    })

    if (!currentReport) {
      return errorResponse('Reporte no encontrado', 404)
    }

    const updates = {}
    if (data.fecha !== undefined) updates.fecha = new Date(data.fecha)
    if (data.areaId !== undefined) updates.areaId = Number(data.areaId)
    if (data.cantidadAccidentes !== undefined) updates.cantidadAccidentes = Number(data.cantidadAccidentes)
    if (data.cantidadCuasiAccidentes !== undefined) updates.cantidadCuasiAccidentes = Number(data.cantidadCuasiAccidentes)

    if (data.fecha !== undefined && new Date(data.fecha).getTime() !== new Date(currentReport.fecha).getTime()) {
      updates.diasUltimoAccidente = await calculateDaysSinceLast(
        currentReport.areaId, 
        data.fecha
      )
    }

    const updatedReport = await prisma.$transaction(async (tx) => {
      const report = await tx.accidentReport.update({
        where: { id: Number(id) },
        data: updates,
        include: { area: true }
      })

      if (data.fecha !== undefined) {
        const latestAccident = await tx.accidentReport.findFirst({
          where: { areaId: report.areaId },
          orderBy: { fecha: 'desc' },
          select: { id: true, fecha: true }
        })

        if (latestAccident && latestAccident.id === report.id) {
          await tx.area.update({
            where: { id: report.areaId },
            data: { lastAccidentDate: new Date(data.fecha) }
          })

          const nextAccident = await tx.accidentReport.findFirst({
            where: {
              areaId: report.areaId,
              id: { not: report.id },
              fecha: { gt: new Date(data.fecha) }
            },
            orderBy: { fecha: 'asc' },
            select: { id: true, fecha: true }
          })

          if (nextAccident) {
            const daysDifference = Math.floor(
              (new Date(nextAccident.fecha) - new Date(data.fecha)) / 
              (1000 * 60 * 60 * 24)
            )
            
            await tx.accidentReport.update({
              where: { id: nextAccident.id },
              data: { diasUltimoAccidente: daysDifference }
            })
          }
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

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders })
}
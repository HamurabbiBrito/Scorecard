import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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

// Validación de datos
const validateQualityReport = (data) => {
  const errors = {};
  if (!data.fecha) errors.fecha = 'Fecha es requerida';
  if (!data.qualityCreditNoteUSD) errors.qualityCreditNoteUSD = 'Quality Credit Note USD es requerido';
  if (!data.mesAnterior) errors.mesAnterior = 'Mes anterior es requerido';
  if (!data.numero) errors.numero = 'Número es requerido';
  
  return {
    success: Object.keys(errors).length === 0,
    errors
  };
}

// GET - Obtener reportes de calidad
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const areaId = searchParams.get('areaId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const whereClause = areaId && !isNaN(areaId) 
      ? { areaId: Number(areaId) } 
      : {}

    const [reports, total] = await prisma.$transaction([
      prisma.qualityReport.findMany({
        where: whereClause,
        include: { area: true },
        orderBy: { fecha: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.qualityReport.count({ where: whereClause })
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
    console.error('Error GET /api/quality-reports:', error)
    return errorResponse('Error al obtener datos', 500)
  }
}

// POST - Crear nuevo reporte de calidad
export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return errorResponse('Formato de contenido no válido', 415)
    }

    const data = await request.json()
    
    const validation = validateQualityReport(data)
    if (!validation.success) {
      return errorResponse(validation.errors, 400)
    }

    const newReport = await prisma.qualityReport.create({
      data: {
        fecha: new Date(data.fecha),
        areaId: Number(data.areaId),
        qualityCreditNoteUSD: data.qualityCreditNoteUSD,
        qualityCreditNoteUSDBattery: Number(data.qualityCreditNoteUSDBattery) || 0,
        mesAnterior: data.mesAnterior,
        numero: data.numero,
        cantidadQuejas: Number(data.cantidadQuejas) || 0,
        cantidadQuejasBateria: Number(data.cantidadQuejasBateria) || 0
      },
      include: { area: true }
    })

    return successResponse(newReport, 201)

  } catch (error) {
    console.error('Error POST /api/quality-reports:', error)
    return errorResponse('Error interno del servidor', 500)
  }
}

// PATCH - Actualizar reporte existente
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

    const updates = {}
    if (data.fecha !== undefined) updates.fecha = new Date(data.fecha)
    if (data.qualityCreditNoteUSD !== undefined) updates.qualityCreditNoteUSD = data.qualityCreditNoteUSD
    if (data.qualityCreditNoteUSDBattery !== undefined) updates.qualityCreditNoteUSDBattery = Number(data.qualityCreditNoteUSDBattery)
    if (data.mesAnterior !== undefined) updates.mesAnterior = data.mesAnterior
    if (data.numero !== undefined) updates.numero = data.numero
    if (data.cantidadQuejas !== undefined) updates.cantidadQuejas = Number(data.cantidadQuejas)
    if (data.cantidadQuejasBateria !== undefined) updates.cantidadQuejasBateria = Number(data.cantidadQuejasBateria)

    const updatedReport = await prisma.qualityReport.update({
      where: { id: Number(id) },
      data: updates,
      include: { area: true }
    })

    return successResponse(updatedReport)

  } catch (error) {
    console.error('Error PATCH /api/quality-reports:', error)
    
    if (error.code === 'P2025') {
      return errorResponse('Reporte no encontrado', 404)
    }
    
    return errorResponse('Error interno del servidor', 500)
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validatePartialAccidentReport } from '@/validations/accidentReports'

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

export async function PATCH(request, { params }) {
  try {
    // Asegurar que params esté disponible
    const { id } = params
    
    if (!id || isNaN(id)) {
      return errorResponse('ID de reporte no válido', 400)
    }

    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return errorResponse('Formato de contenido no válido', 415)
    }

    const data = await request.json()
    
    const validation = validatePartialAccidentReport(data)
    if (!validation.success) {
      return errorResponse(validation.error.message, 400)
    }

    // Obtener el reporte actual
    const currentReport = await prisma.accidentReport.findUnique({
      where: { id: Number(id) },
      select: { 
        fecha: true,
        areaId: true,
        diasUltimoAccidente: true
      }
    })

    if (!currentReport) {
      return errorResponse('Reporte no encontrado', 404)
    }

    // Preparar datos para actualización
    const updateData = {
      fecha: new Date(data.fecha || currentReport.fecha),
      cantidadAccidentes: Number(data.cantidadAccidentes || 0),
      cantidadCuasiAccidentes: Number(data.cantidadCuasiAccidentes || 0),
      diasUltimoAccidente: currentReport.diasUltimoAccidente // Valor por defecto
    }

    // Recalcular días si cambió la fecha
    if (data.fecha && new Date(data.fecha).getTime() !== new Date(currentReport.fecha).getTime()) {
      const lastAccident = await prisma.accidentReport.findFirst({
        where: { 
          areaId: currentReport.areaId,
          fecha: { lt: new Date(data.fecha) },
          NOT: { id: Number(id) }
        },
        orderBy: { fecha: 'desc' },
        select: { fecha: true }
      })

      updateData.diasUltimoAccidente = lastAccident 
        ? Math.floor((new Date(data.fecha) - new Date(lastAccident.fecha)) / (1000 * 60 * 60 * 24))
        : 0
    }

    // Actualizar el reporte
    const updatedReport = await prisma.accidentReport.update({
      where: { id: Number(id) },
      data: updateData,
      include: { area: true }
    })

    return NextResponse.json(updatedReport, { 
      status: 200,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Error PATCH /api/accidents/[id]:', error)
    
    if (error.code === 'P2025') {
      return errorResponse('Reporte no encontrado', 404)
    }
    
    return errorResponse('Error interno del servidor', 500)
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders })
}
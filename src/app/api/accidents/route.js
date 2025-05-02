import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateAccidentReport } from '@/validations/accidentReports' // Asumiendo una capa de validación separada

// Configuración de CORS para desarrollo
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Formato de contenido no válido' },
        { status: 415, headers: corsHeaders }
      )
    }

    const data = await request.json()
    
    // Validación mejorada
    const validation = validateAccidentReport(data)
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.errors },
        { status: 400, headers: corsHeaders }
      )
    }

    // Optimización: Transacción para múltiples operaciones
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

      // Actualización válida con el nuevo campo
  await tx.area.update({
    where: { id: Number(data.areaId) },
    data: {
      lastAccidentDate: new Date(data.fecha) // Usar el campo existente
    }
  });

  return report;
});
    return NextResponse.json(newReport, {
      status: 201,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Error POST /api/accidents:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, // Mensaje genérico para producción
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const areaId = searchParams.get('areaId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Validación de parámetros
    if (isNaN(page) || isNaN(limit)) {
      return NextResponse.json(
        { error: 'Parámetros de paginación inválidos' },
        { status: 400, headers: corsHeaders }
      )
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

    return NextResponse.json({
      data: reports,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Error GET /api/accidents:', error)
    return NextResponse.json(
      { error: 'Error al obtener datos' },
      { status: 500, headers: corsHeaders }
    )
  }
}

// Manejo de CORS para preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: corsHeaders
  })
}
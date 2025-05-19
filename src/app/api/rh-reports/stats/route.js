import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET - Estadísticas de reportes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const areaId = searchParams.get('areaId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!areaId) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro areaId' },
        { status: 400 }
      )
    }

    const reports = await prisma.rHReport.findMany({
      where: {
        areaId: Number(areaId),
        fecha: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined
        }
      }
    })

    const stats = {
      totalReports: reports.length,
      avgAbsenteeism: reports.reduce((sum, r) => sum + r.hrAbsenteeims, 0) / (reports.length || 1),
      avgInability: reports.reduce((sum, r) => sum + r.hrInability, 0) / (reports.length || 1),
      avgTurnover: reports.reduce((sum, r) => sum + r.hrTurnover, 0) / (reports.length || 1)
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error al calcular estadísticas' },
      { status: 500 }
    )
  }
}

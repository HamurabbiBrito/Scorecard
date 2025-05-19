import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }

  try {
    const data = await request.json()

    // Validaciones
    if (!data.areaId || isNaN(data.areaId)) {
      return NextResponse.json(
        { error: 'ID de área inválido' },
        { status: 400 }
      )
    }

    if (!data.fecha) {
      return NextResponse.json(
        { error: 'Fecha es requerida' },
        { status: 400 }
      )
    }

    const report = await prisma.rHReport.create({
      data: {
        areaId: Number(data.areaId),
        fecha: new Date(data.fecha),
        hrAbsenteeims: parseInt(data.hrAbsenteeims) || 0,
        hrInability: parseInt(data.hrInability) || 0,
        hrTurnover: parseInt(data.hrTurnover) || 0
      },
      include: {
        area: true
      }
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/rh-reports:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno al crear el reporte' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const data = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID de reporte no proporcionado' },
        { status: 400 }
      )
    }

    const updatedReport = await prisma.rHReport.update({
      where: { id: Number(id) },
      data: {
        fecha: data.fecha ? new Date(data.fecha) : undefined,
        hrAbsenteeims: data.hrAbsenteeims !== undefined ? parseInt(data.hrAbsenteeims) : undefined,
        hrInability: data.hrInability !== undefined ? parseInt(data.hrInability) : undefined,
        hrTurnover: data.hrTurnover !== undefined ? parseInt(data.hrTurnover) : undefined
      },
      include: {
        area: true
      }
    })

    return NextResponse.json(updatedReport, { status: 200 })
  } catch (error) {
    console.error('Error en PUT /api/rh-reports:', error)
    return NextResponse.json(
      { error: error.message || 'Error al actualizar el reporte' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const areaId = searchParams.get('areaId')

    if (!areaId) {
      return NextResponse.json(
        { error: 'ID de área no proporcionado' },
        { status: 400 }
      )
    }

    const reports = await prisma.rHReport.findMany({
      where: { areaId: Number(areaId) },
      include: {
        area: true
      },
      orderBy: {
        fecha: 'desc'
      }
    })

    return NextResponse.json({ data: reports }, { status: 200 })
  } catch (error) {
    console.error('Error en GET /api/rh-reports:', error)
    return NextResponse.json(
      { error: 'Error al obtener reportes de RH' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de reporte no proporcionado' },
        { status: 400 }
      )
    }

    await prisma.rHReport.delete({
      where: { id: Number(id) }
    })

    return NextResponse.json(
      { success: true, message: 'Reporte eliminado correctamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en DELETE /api/rh-reports:', error)
    return NextResponse.json(
      { error: error.message || 'Error al eliminar el reporte' },
      { status: 500 }
    )
  }
}
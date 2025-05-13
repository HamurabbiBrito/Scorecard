// app/api/quejas-reports/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();

    // Validaciones
    if (!data.areaId || isNaN(data.areaId)) {
      return NextResponse.json(
        { error: 'ID de área inválido' },
        { status: 400 }
      );
    }

    if (!data.tipo || !['CLIENTE', 'BATERIA'].includes(data.tipo)) {
      return NextResponse.json(
        { error: 'Tipo de queja inválido (debe ser CLIENTE o BATERIA)' },
        { status: 400 }
      );
    }

    if (!data.fechaQueja) {
      return NextResponse.json(
        { error: 'Fecha de queja es requerida' },
        { status: 400 }
      );
    }

    if (data.cantidadQuejas === undefined || data.cantidadQuejas < 0) {
      return NextResponse.json(
        { error: 'Cantidad de quejas inválida' },
        { status: 400 }
      );
    }

    const report = await prisma.quejasReport.create({
      data: {
        areaId: Number(data.areaId),
        tipo: data.tipo,
        fechaQueja: new Date(data.fechaQueja),
        cantidadQuejas: parseInt(data.cantidadQuejas),
        diasSinQueja: parseInt(data.diasSinQueja) || 0
      },
      include: {
        area: true
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/quejas-reports:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno al crear el reporte' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID de reporte no proporcionado' },
        { status: 400 }
      );
    }

    const updatedReport = await prisma.quejasReport.update({
      where: { id: Number(id) },
      data: {
        tipo: data.tipo,
        fechaQueja: data.fechaQueja ? new Date(data.fechaQueja) : undefined,
        cantidadQuejas: data.cantidadQuejas !== undefined ? parseInt(data.cantidadQuejas) : undefined,
        diasSinQueja: data.diasSinQueja !== undefined ? parseInt(data.diasSinQueja) : undefined
      },
      include: {
        area: true
      }
    });

    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    console.error('Error en PUT /api/quejas-reports:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar el reporte' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const areaId = searchParams.get('areaId');
    const tipo = searchParams.get('tipo');

    if (!areaId) {
      return NextResponse.json(
        { error: 'ID de área no proporcionado' },
        { status: 400 }
      );
    }

    const where = { areaId: Number(areaId) };
    
    if (tipo && ['CLIENTE', 'BATERIA'].includes(tipo)) {
      where.tipo = tipo;
    }

    const reports = await prisma.quejasReport.findMany({
      where,
      include: {
        area: true
      },
      orderBy: {
        fechaQueja: 'desc'
      }
    });

    // Modificado para devolver { data } que es lo que espera ReportList
    return NextResponse.json({ data: reports }, { status: 200 });
    
  } catch (error) {
    console.error('Error en GET /api/quejas-reports:', error);
    return NextResponse.json(
      { error: 'Error al obtener reportes de quejas' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de reporte no proporcionado' },
        { status: 400 }
      );
    }

    await prisma.quejasReport.delete({
      where: { id: Number(id) }
    });

    return NextResponse.json(
      { success: true, message: 'Reporte eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en DELETE /api/quejas-reports:', error);
    return NextResponse.json(
      { error: error.message || 'Error al eliminar el reporte' },
      { status: 500 }
    );
  }
}
// app/api/quejas-reports/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    // Validación adicional
    if (!data.areaId || isNaN(data.areaId)) {
      return NextResponse.json(
        { error: 'ID de área inválido' },
        { status: 400 }
      );
    }

    const report = await prisma.quejasReport.create({
      data: {
        areaId: Number(data.areaId),
        fechaQuejaCliente: new Date(data.fechaQuejaCliente),
        fechaQuejaClienteBateria: new Date(data.fechaQuejaClienteBateria),
        cantidadQuejas: parseInt(data.cantidadQuejas) || 0,
        cantidadQuejasBateria: parseInt(data.cantidadQuejasBateria) || 0,
        diasSinQuejas: parseInt(data.diasSinQueja) || 0,
        diasSinQuejasBateria: parseInt(data.diasSinQuejaBateria) || 0
      },
      include: {
        area: true
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error interno' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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
        fechaQuejaCliente: data.fechaQuejaCliente ? new Date(data.fechaQuejaCliente) : undefined,
        fechaQuejaClienteBateria: data.fechaQuejaClienteBateria ? new Date(data.fechaQuejaClienteBateria) : undefined,
        cantidadQuejas: data.cantidadQuejas !== undefined ? parseInt(data.cantidadQuejas) : undefined,
        cantidadQuejasBateria: data.cantidadQuejasBateria !== undefined ? parseInt(data.cantidadQuejasBateria) : undefined,
        diasSinQuejas: data.diasSinQueja !== undefined ? parseInt(data.diasSinQueja) : undefined,
        diasSinQuejasBateria: data.diasSinQuejaBateria !== undefined ? parseInt(data.diasSinQuejaBateria) : undefined
      },
      include: {
        area: true
      }
    });

    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
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

    if (!areaId) {
      return NextResponse.json(
        { error: 'ID de área no proporcionado' },
        { status: 400 }
      );
    }

    const reports = await prisma.quejasReport.findMany({
      where: { areaId: Number(areaId) },
      include: {
        area: true
      },
      orderBy: {
        fechaQuejaCliente: 'desc'
      }
    });
    return new Response(
      JSON.stringify({ data: reports }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error GET /api/quejas-reports:', error);
    
    // Respuesta de error (500 Internal Server Error)
    return new Response(
      JSON.stringify({ error: 'Error al obtener reportes de quejas' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function DELETE(request) {
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
    return NextResponse.json(
      { error: error.message || 'Error al eliminar el reporte' },
      { status: 500 }
    );
  }
}
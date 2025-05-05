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
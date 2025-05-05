import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    // Validación básica
    if (!data.areaId || isNaN(data.areaId)) {
      return NextResponse.json(
        { error: 'ID de área inválido' },
        { status: 400 }
      );
    }

    const newReport = await prisma.fleteReport.create({
      data: {
        fecha: new Date(data.fecha),
        areaId: Number(data.areaId),
        specialFreight: data.specialFreight,
        specialFreightCustomer: data.specialFreightCustomer || null
      },
      include: {
        area: true
      }
    });

    return NextResponse.json(newReport, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
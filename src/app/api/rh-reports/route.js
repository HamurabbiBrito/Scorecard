import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    // Validación básica
    if (!data.areaId) {
      return NextResponse.json(
        { error: 'El ID del área es requerido' },
        { status: 400 }
      );
    }

    const newReport = await prisma.rHReport.create({
      data: {
        fecha: new Date(data.fecha),
        areaId: Number(data.areaId),
        hrAbsenteeims: parseInt(data.hrAbsenteeims) || 0,
        hrInability: parseInt(data.hrInability) || 0,
        hrTurnover: parseInt(data.hrTurnover) || 0
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
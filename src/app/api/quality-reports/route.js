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

    const newReport = await prisma.qualityReport.create({
      data: {
        fecha: new Date(data.fecha),
        areaId: Number(data.areaId), // Asegurar que es número
        qualityCreditNoteUSD: data.qualityCreditNoteUSD,
        qualityCreditNoteUSDBattery: parseFloat(data.qualityCreditNoteUSDBattery) || 0,
        mesAnterior: data.mesAnterior,
        numero: data.numero,
        cantidadQuejas: parseInt(data.cantidadQuejas) || 0,
        cantidadQuejasBateria: parseInt(data.cantidadQuejasBateria) || 0
      },
      include: {
        area: true
      }
    });

    return NextResponse.json(newReport, { status: 201 });
    
  } catch (error) {
    console.error('Error creating quality report:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
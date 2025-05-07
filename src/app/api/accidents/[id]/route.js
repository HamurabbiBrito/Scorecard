import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de reporte no válido' },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Validación básica
    if (!data.fecha || isNaN(new Date(data.fecha))) {
      return NextResponse.json(
        { error: 'Fecha no válida' },
        { status: 400 }
      );
    }

    const updatedReport = await prisma.accidentReport.update({
      where: { id: Number(id) },
      data: {
        fecha: new Date(data.fecha),
        cantidadAccidentes: Number(data.cantidadAccidentes),
        cantidadCuasiAccidentes: Number(data.cantidadCuasiAccidentes),
        diasUltimoAccidente: Number(data.diasUltimoAccidente)
      }
    });

    return NextResponse.json(updatedReport);

  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
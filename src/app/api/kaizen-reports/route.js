// app/api/kaizen-reports/route.js
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

    const report = await prisma.kaizenReport.create({
      data: {
        fecha: new Date(data.fecha),
        areaId: Number(data.areaId),
        percentAudit5s: parseFloat(data.percentAudit5s) || 0,
        kaizenIdeas: parseInt(data.kaizenIdeas) || 0,
        savings: parseInt(data.savings) || 0,
        projectDescription: data.projectDescription,
        anualProjectDescription: data.anualProjectDescription,
        savingsAnual: data.savingsAnualTarget,
        target5s: data.target5s,
        numeroKaizen: parseFloat(data.numeroKaizen) || 0
      },
      include: {
        area: true
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
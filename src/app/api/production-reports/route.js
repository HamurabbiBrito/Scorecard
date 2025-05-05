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

    const newReport = await prisma.productionReport.create({
      data: {
        fecha: new Date(data.fecha),
        areaId: Number(data.areaId),
        maquinas: data.maquina,
        numeroSap: parseFloat(data.numeroSap) || 0,
        produccionKm: parseFloat(data.produccionKm) || 0,
        produccionKg: parseFloat(data.produccionKg) || 0,
        kgScrap: parseFloat(data.kgScrap) || 0,
        percentScrap: parseFloat(data.percentScrap) || 0,
        oee: parseFloat(data.oee) || 0,
        percentAvailability: parseFloat(data.percentAvailability) || 0,
        percentPerformance: parseFloat(data.percentPerformance) || 0,
        percentQuality: parseFloat(data.percentQuality) || 0,
        reventones: parseInt(data.reventones) || 0,
        tiempoMuerto: parseInt(data.tiempoMuerto) || 0,
        kmReventon: parseFloat(data.kmReventon) || 0,
        scrapCu: parseFloat(data.scrapCu) || 0,
        scrapSn: parseFloat(data.scrapSn) || 0,
        scrapTotal: parseFloat(data.scrapTotal) || 0,
        yield: parseFloat(data.yield) || 0,
        yieldTotal: parseFloat(data.yieldTotal) || 0,
        kmEnviadosRebobinados: parseFloat(data.kmEnviadosRebobinados) || 0,
        kmRebobinados: parseFloat(data.kmRebobinados) || 0,
        targetOeeL5: parseFloat(data.targetOeeL5) || 0,
        targetScrapL5: parseFloat(data.targetScrapL5) || 0,
        comentariosOee: data.comentariosOee,
        comentariosScrap: data.comentariosScrap,
        concatenado: data.concatenado,
        validacion: data.validacion
      },
      include: {
        area: true
      }
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error('Error creating production report:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
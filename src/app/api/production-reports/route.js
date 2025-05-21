import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const areaId = searchParams.get('areaId');

    if (!areaId || isNaN(areaId)) {
      return NextResponse.json(
        { error: 'ID de área inválido o faltante' },
        { status: 400 }
      );
    }

     const reports = await prisma.productionReport.findMany({
      where: { areaId: Number(areaId) },
      orderBy: { fecha: 'desc' },
      include: { 
        area: { 
          select: { 
            nombre: true 
          } 
        } 
      }  // Aquí estaba el error - ahora correctamente formateado
    });

    const formattedReports = reports.map(report => ({
      ...report,
      fecha: report.fecha.toISOString().split('T')[0],
      maquina: report.maquinas // Mapear nombre de campo
    }));

    return NextResponse.json({ data: formattedReports }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener reportes: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const errors = [];

    // Validaciones básicas
    if (!data.areaId || isNaN(data.areaId)) errors.push('ID de área inválido');
    if (!data.fecha || isNaN(new Date(data.fecha).getTime())) errors.push('Fecha inválida');

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' | ') }, { status: 400 });
    }

    const report = await prisma.productionReport.create({
      data: {
        fecha: new Date(data.fecha),
        areaId: Number(data.areaId),
        maquinas: data.maquina,
        numeroSap: data.numeroSap || '',
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
        comentariosOee: data.comentariosOee || '',
        comentariosScrap: data.comentariosScrap || '',
        concatenado: data.concatenado || '',
        validacion: data.validacion || ''
      }
    });

    return NextResponse.json(report, { status: 201 });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al crear reporte: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de reporte inválido' },
        { status: 400 }
      );
    }

    const updatedReport = await prisma.productionReport.update({
      where: { id: Number(id) },
      data: {
        fecha: new Date(data.fecha),
        maquinas: data.maquina,
        numeroSap: data.numeroSap || '',
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
        comentariosOee: data.comentariosOee || '',
        comentariosScrap: data.comentariosScrap || '',
        concatenado: data.concatenado || '',
        validacion: data.validacion || ''
      }
    });

    return NextResponse.json(updatedReport);

  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar: ' + error.message },
      { status: 500 }
    );
  }
}
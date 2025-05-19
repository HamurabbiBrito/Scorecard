// app/api/control-reports/route.js
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

    const reports = await prisma.controlReport.findMany({
      where: { areaId: Number(areaId) },
      orderBy: { fecha: 'desc' },
      include: { area: { select: { nombre: true } } }
    });

    const formattedReports = reports.map(report => ({
      ...report,
      fecha: report.fecha.toISOString().split('T')[0],
      dlp: report.dlp ?? 0,
      capacityUtilization: report.capacityUtilization ?? 0,
      dlpBattery: report.dlpBattery ?? 0,
      capacityUtilizationBattery: report.capacityUtilizationBattery ?? 0,
      variationsInventoryCobreUSD: report.variationsInventoryCobreUSD ?? 0,
      variationsInventoryCobreKg: report.variationsInventoryCobreKg ?? 0,
      variationsInventoryCompuestoUSD: report.variationsInventoryCompuestoUSD ?? 0,
      variationsInventoryCompuestoKg: report.variationsInventoryCompuestoKg ?? 0,
      variationsInventoryCableUSD: report.variationsInventoryCableUSD ?? 0,
      variationsInventoryCableKg: report.variationsInventoryCableKg ?? 0,
      dlpSemana: report.dlpSemana ?? 0,
      dlpSemanaMaterial: report.dlpSemanaMaterial ?? 0,
      metaMensual: report.metaMensual ?? 0,
      metaMensualBateria: report.metaMensualBateria ?? 0,
      impactoDlpEnUsd: report.impactoDlpEnUsd ?? 0,
      impactoDlpEnUsdBateria: report.impactoDlpEnUsdBateria ?? 0
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

    // Validación directa en el método
    const errors = [];

    // Validaciones básicas
    if (!data.areaId || isNaN(data.areaId)) errors.push('ID de área inválido');
    if (!data.fecha || isNaN(new Date(data.fecha).getTime())) errors.push('Fecha inválida');

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' | ') }, { status: 400 });
    }

    // Crear reporte con los nombres de campos correctos
    const report = await prisma.controlReport.create({
      data: {
        fecha: new Date(data.fecha),
        areaId: Number(data.areaId),
        dlp: parseFloat(data.dlp) || 0,
        capacityUtilization: parseFloat(data.capacityUtilization) || 0,
        dlpBattery: parseFloat(data.dlpBattery) || 0,
        capacityUtilizationBattery: parseFloat(data.capacityUtilizationBattery) || 0,
        variationsInventoryCobreUSD: parseFloat(data.variationsInventoryCobreUSD) || 0,
        variationsInventoryCobreKg: parseFloat(data.variationsInventoryCobreKg) || 0,
        variationsInventoryCompuestoUSD: parseFloat(data.variationsInventoryCompuestoUSD) || 0,
        variationsInventoryCompuestoKg: parseFloat(data.variationsInventoryCompuestoKg) || 0,
        variationsInventoryCableUSD: parseFloat(data.variationsInventoryCableUSD) || 0,
        variationsInventoryCableKg: parseFloat(data.variationsInventoryCableKg) || 0,
        dlpSemana: parseFloat(data.dlpSemana) || 0,
        dlpSemanaMaterial: parseFloat(data.dlpSemanaMaterial) || 0,
        metaMensual: parseFloat(data.metaMensual) || 0,
        metaMensualBateria: parseFloat(data.metaMensualBateria) || 0,
        impactoDlpEnUsd: parseFloat(data.impactoDlpUSD) || 0,  // Campo corregido
        impactoDlpEnUsdBateria: parseFloat(data.impactoDlpUSDBateria) || 0  // Campo corregido
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error completo:', error);
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

    // (Reutilizar validaciones del POST si es necesario)

    const updatedReport = await prisma.controlReport.update({
      where: { id: Number(id) },
      data: {
        fecha: new Date(data.fecha),
        dlp: parseFloat(data.dlp),
        // ... (otros campos a actualizar)
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
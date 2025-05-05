// app/api/control-reports/route.js
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

    const report = await prisma.controlReport.create({
      data: {
        fecha: new Date(data.fecha),
        areaId: data.areaId,
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
        impactoDlpEnUsd: parseFloat(data.impactoDlpUSD) || 0,
        impactoDlpEnUsdBateria: parseFloat(data.impactoDlpUSDBateria) || 0
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
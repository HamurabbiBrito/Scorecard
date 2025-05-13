import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const successResponse = (data, status = 200) => {
  return NextResponse.json(data, { status, headers: corsHeaders });
};

const errorResponse = (message, status = 400) => {
  return NextResponse.json({ error: message }, { status, headers: corsHeaders });
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const areaId = searchParams.get('areaId');
    
    console.log('[GET] Request for areaId:', areaId); // Debug log

    if (!areaId || isNaN(areaId)) {
      return errorResponse('ID de área inválido', 400);
    }

    const reports = await prisma.kaizenReport.findMany({
      where: { areaId: Number(areaId) },
      include: { area: true },
      orderBy: { fecha: 'desc' },
    });

    console.log('[GET] Found reports:', reports.length); // Debug log
    return successResponse(reports);
  } catch (error) {
    console.error('[GET] Error:', error);
    return errorResponse('Error al obtener reportes', 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('[POST] Data received:', data); // Debug log

    if (!data.areaId || isNaN(data.areaId)) {
      return errorResponse('ID de área inválido', 400);
    }

    const newReport = await prisma.kaizenReport.create({
      data: {
        areaId: Number(data.areaId),
        fecha: new Date(data.fecha),
        percentAudit5s: Number(data.percentAudit5s) || 0,
        kaizenIdeas: Number(data.kaizenIdeas) || 0,
        savings: Number(data.savings) || 0,
        projectDescription: data.projectDescription || '',
        anualProjectDescription: data.anualProjectDescription || '',
        savingsAnual: data.savingsAnual || '',
        target5s: data.target5s || '',
        numeroKaizen: Number(data.numeroKaizen) || 0,
      },
      include: { area: true },
    });

    console.log('[POST] Report created:', newReport); // Debug log
    return successResponse(newReport, 201);
  } catch (error) {
    console.error('[POST] Error:', error);
    return errorResponse('Error al crear reporte', 500);
  }
}

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();

    console.log('[PATCH] Updating report ID:', id, 'with data:', data); // Debug log

    if (!id || isNaN(id)) {
      return errorResponse('ID de reporte inválido', 400);
    }

    const updatedReport = await prisma.kaizenReport.update({
      where: { id: Number(id) },
      data: {
        fecha: data.fecha ? new Date(data.fecha) : undefined,
        percentAudit5s: data.percentAudit5s !== undefined ? Number(data.percentAudit5s) : undefined,
        kaizenIdeas: data.kaizenIdeas !== undefined ? Number(data.kaizenIdeas) : undefined,
        savings: data.savings !== undefined ? Number(data.savings) : undefined,
        projectDescription: data.projectDescription || undefined,
        anualProjectDescription: data.anualProjectDescription || undefined,
        savingsAnual: data.savingsAnual || undefined,
        target5s: data.target5s || undefined,
        numeroKaizen: data.numeroKaizen !== undefined ? Number(data.numeroKaizen) : undefined,
      },
      include: { area: true },
    });

    console.log('[PATCH] Report updated:', updatedReport); // Debug log
    return successResponse(updatedReport);
  } catch (error) {
    console.error('[PATCH] Error:', error);
    return errorResponse('Error al actualizar reporte', 500);
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log('[DELETE] Deleting report ID:', id); // Debug log

    if (!id || isNaN(id)) {
      return errorResponse('ID de reporte inválido', 400);
    }

    await prisma.kaizenReport.delete({
      where: { id: Number(id) },
    });

    console.log('[DELETE] Report deleted successfully'); // Debug log
    return successResponse({ message: 'Reporte eliminado correctamente' });
  } catch (error) {
    console.error('[DELETE] Error:', error);
    return errorResponse('Error al eliminar reporte', 500);
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
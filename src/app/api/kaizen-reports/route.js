import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const successResponse = (data, status = 200) => {
  return NextResponse.json({ success: true, data }, { status, headers: corsHeaders });
};

const errorResponse = (message, status = 400) => {
  return NextResponse.json({ success: false, error: message }, { status, headers: corsHeaders });
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const areaId = searchParams.get('areaId');
    
    if (!areaId || isNaN(areaId)) {
      return errorResponse('ID de área inválido', 400);
    }

    const reports = await prisma.kaizenReport.findMany({
      where: { areaId: Number(areaId) },
      select: {
        id: true,
        fecha: true,
        percentAudit5s: true,
        kaizenIdeas: true,
        savings: true,
        projectDescription: true,
        anualProjectDescription: true,
        savingsAnual: true,
        target5s: true,
        numeroKaizen: true,
        area: { select: { id: true, nombre: true } }
      },
      orderBy: { fecha: 'desc' },
    });

    return successResponse(reports);
  } catch (error) {
    console.error('[GET] Error:', error);
    return errorResponse('Error al obtener reportes', 500);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.areaId || isNaN(data.areaId)) {
      return errorResponse('ID de área inválido', 400);
    }

    const requiredFields = ['fecha', 'projectDescription'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return errorResponse(`Campos requeridos faltantes: ${missingFields.join(', ')}`, 400);
    }

    const newReport = await prisma.kaizenReport.create({
      data: {
        areaId: Number(data.areaId),
        fecha: new Date(data.fecha),
        percentAudit5s: Number(data.percentAudit5s) || 0,
        kaizenIdeas: Number(data.kaizenIdeas) || 0,
        savings: Number(data.savings) || 0,
        projectDescription: data.projectDescription,
        anualProjectDescription: data.anualProjectDescription || '',
        savingsAnual: data.savingsAnual || '',
        target5s: data.target5s || '',
        numeroKaizen: Number(data.numeroKaizen) || 0,
      },
      select: {
        id: true,
        fecha: true,
        percentAudit5s: true,
        kaizenIdeas: true,
        savings: true,
        projectDescription: true,
        anualProjectDescription: true,
        savingsAnual: true,
        target5s: true,
        numeroKaizen: true,
      }
    });

    return successResponse(newReport, 201);
  } catch (error) {
    console.error('[POST] Error:', error);
    return errorResponse(error.message || 'Error al crear reporte', 500);
  }
}

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();

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
        projectDescription: data.projectDescription,
        anualProjectDescription: data.anualProjectDescription,
        savingsAnual: data.savingsAnual,
        target5s: data.target5s,
        numeroKaizen: data.numeroKaizen !== undefined ? Number(data.numeroKaizen) : undefined,
      },
      select: {
        id: true,
        fecha: true,
        percentAudit5s: true,
        kaizenIdeas: true,
        savings: true,
        projectDescription: true,
        anualProjectDescription: true,
        savingsAnual: true,
        target5s: true,
        numeroKaizen: true,
      }
    });

    return successResponse(updatedReport);
  } catch (error) {
    console.error('[PATCH] Error:', error);
    return errorResponse(error.message || 'Error al actualizar reporte', 500);
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(id)) {
      return errorResponse('ID de reporte inválido', 400);
    }

    await prisma.kaizenReport.delete({
      where: { id: Number(id) },
    });

    return successResponse({ message: 'Reporte eliminado correctamente' });
  } catch (error) {
    console.error('[DELETE] Error:', error);
    return errorResponse(error.message || 'Error al eliminar reporte', 500);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}
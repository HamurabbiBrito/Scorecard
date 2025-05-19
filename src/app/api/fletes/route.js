import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();

    // Validación exhaustiva
    if (!data.areaId || isNaN(data.areaId)) {
      return NextResponse.json(
        { 
          error: 'ID de área inválido',
          details: 'El ID de área debe ser un número válido'
        },
        { status: 400 }
      );
    }

    if (!data.fecha || isNaN(new Date(data.fecha).getTime())) {
      return NextResponse.json(
        { 
          error: 'Fecha inválida',
          details: 'La fecha proporcionada no es válida'
        },
        { status: 400 }
      );
    }

    if (!data.specialFreight || typeof data.specialFreight !== 'string' || data.specialFreight.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Special freight inválido',
          details: 'El campo special freight es requerido y debe ser texto'
        },
        { status: 400 }
      );
    }

    // Validar longitud máxima
    if (data.specialFreight.length > 100) {
      return NextResponse.json(
        { 
          error: 'Special freight demasiado largo',
          details: 'El special freight no puede exceder los 100 caracteres'
        },
        { status: 400 }
      );
    }

    if (data.specialFreightCustomer && data.specialFreightCustomer.length > 100) {
      return NextResponse.json(
        { 
          error: 'Cliente demasiado largo',
          details: 'El nombre del cliente no puede exceder los 100 caracteres'
        },
        { status: 400 }
      );
    }

    // Crear el registro en la base de datos
    const newReport = await prisma.fleteReport.create({
      data: {
        fecha: new Date(data.fecha),
        areaId: Number(data.areaId),
        specialFreight: data.specialFreight.trim(),
        specialFreightCustomer: data.specialFreightCustomer ? data.specialFreightCustomer.trim() : null
      },
      include: {
        area: {
          select: {
            id: true,
            nombre: true,
            slug: true
          }
        }
      }
    });

    // Formatear la respuesta
    const responseData = {
      id: newReport.id,
      fecha: newReport.fecha.toISOString().split('T')[0], // Formato YYYY-MM-DD
      specialFreight: newReport.specialFreight,
      specialFreightCustomer: newReport.specialFreightCustomer,
      area: newReport.area
    };

    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/fletes:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error.message || 'Ocurrió un error al procesar la solicitud'
      },
      { status: 500 }
    );
  }
}

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

    const reports = await prisma.fleteReport.findMany({
      where: {
        areaId: Number(areaId)
      },
      orderBy: {
        fecha: 'desc'
      },
      include: {
        area: {
          select: {
            nombre: true
          }
        }
      }
    });

    // Formatear las fechas en la respuesta
    const formattedReports = reports.map(report => ({
      ...report,
      fecha: report.fecha.toISOString().split('T')[0] // Formato YYYY-MM-DD
    }));

    return NextResponse.json({ data: formattedReports }, { status: 200 });

  } catch (error) {
    console.error('Error en GET /api/fletes:', error);
    return NextResponse.json(
      { error: 'Error al obtener los reportes de fletes' },
      { status: 500 }
    );
  }
}
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de flete inválido o faltante' },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Validación (similar a POST pero para actualización)
    if (!data.areaId || isNaN(data.areaId)) {
      return NextResponse.json(
        { error: 'ID de área inválido' },
        { status: 400 }
      );
    }

    if (!data.fecha || isNaN(new Date(data.fecha).getTime())) {
      return NextResponse.json(
        { error: 'Fecha inválida' },
        { status: 400 }
      );
    }

    if (!data.specialFreight || typeof data.specialFreight !== 'string' || data.specialFreight.trim() === '') {
      return NextResponse.json(
        { error: 'Special freight inválido' },
        { status: 400 }
      );
    }

    // Validar longitud máxima
    if (data.specialFreight.length > 100) {
      return NextResponse.json(
        { error: 'Special freight no puede exceder 100 caracteres' },
        { status: 400 }
      );
    }

    if (data.specialFreightCustomer && data.specialFreightCustomer.length > 100) {
      return NextResponse.json(
        { error: 'Cliente no puede exceder 100 caracteres' },
        { status: 400 }
      );
    }

    const updatedReport = await prisma.fleteReport.update({
      where: { id: Number(id) },
      data: {
        fecha: new Date(data.fecha),
        areaId: Number(data.areaId),
        specialFreight: data.specialFreight.trim(),
        specialFreightCustomer: data.specialFreightCustomer ? data.specialFreightCustomer.trim() : null
      },
      include: {
        area: {
          select: {
            id: true,
            nombre: true,
            slug: true
          }
        }
      }
    });

    // Formatear la respuesta
    const responseData = {
      id: updatedReport.id,
      fecha: updatedReport.fecha.toISOString().split('T')[0], // Formato YYYY-MM-DD
      specialFreight: updatedReport.specialFreight,
      specialFreightCustomer: updatedReport.specialFreightCustomer,
      area: updatedReport.area
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Error en PUT /api/fletes:', error);
    
    // Manejar error específico de registro no encontrado
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'El flete no existe o ya fue eliminado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Error al actualizar el flete',
        details: error.message || 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}
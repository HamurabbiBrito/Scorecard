// app/api/areas/[slug]/route.js
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const area = await prisma.area.findUnique({
      where: { slug: params.slug.toLowerCase() },
      select: { id: true, nombre: true, slug: true }
    });

    if (!area) {
      return new Response(JSON.stringify({ error: 'Área no encontrada' }), {
        status: 404
      });
    }

    return new Response(JSON.stringify(area));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  }
}
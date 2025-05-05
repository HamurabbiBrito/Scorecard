import prisma from '@/lib/prisma';
import Tabs from '@/components/ProductionTabs/Tabs';

export async function generateStaticParams() {
  const areas = await prisma.area.findMany({
    select: { 
      slug: true,
      id: true // Añadimos el id para validación
    }
  });

  return areas.map((area) => ({
    area: area.slug
  }));
}

export default async function Page({ params }) {
  // Obtener el área COMPLETA incluyendo el id
  const area = await prisma.area.findUnique({
    where: { 
      slug: params.area.toLowerCase() 
    },
    select: {
      id: true,
      nombre: true,
      slug: true
    }
  });

  if (!area) {
    return <div className="p-4 text-red-500">Área no encontrada</div>;
  }

  return <Tabs areaInfo={area} />; // Pasamos el objeto completo del área
}
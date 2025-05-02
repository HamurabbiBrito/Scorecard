import prisma from '@/lib/prisma'; // Asegúrate de que la ruta sea correcta
import Tabs from '@/components/ProductionTabs/Tabs'; // Importar con el nombre correcto

export async function generateStaticParams() {
  const areas = await prisma.area.findMany({
    select: { slug: true }
  });

  return areas.map((area) => ({
    area: area.slug
  }));
}

export default async function Page({ params }) {
  return <Tabs areaSlug={params.area} />; // Usar el nombre correcto
}
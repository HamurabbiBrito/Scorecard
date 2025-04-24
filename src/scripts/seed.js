import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

async function seed() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        password: hashedPassword,
        role: 'SA'
      },
      {
        username: 'operador1',
        password: await bcrypt.hash('operador123', 10),
        role: 'Operador'
      }
    ],
    skipDuplicates: true
  });

  console.log('Usuarios creados exitosamente');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
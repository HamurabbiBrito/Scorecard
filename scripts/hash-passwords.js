// scripts/hash-passwords.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // 1. Trae todos los usuarios
  const users = await prisma.user.findMany({
    select: { id: true, password: true }
  });

  for (const user of users) {
    const plain = user.password;

    // 2. Si ya está hasheada (detectamos un prefijo de bcrypt), la saltamos
    if (/^\$2[aby]\$/.test(plain)) {
      console.log(`– Usuario ${user.id}: ya está hasheada, saltando`);
      continue;
    }

    // 3. Hashea la contraseña en texto plano
    const hash = await bcrypt.hash(plain, 10);

    // 4. Actualiza el usuario con el hash
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hash }
    });

    console.log(`✓ Usuario ${user.id}: contraseña actualizada`);
  }
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

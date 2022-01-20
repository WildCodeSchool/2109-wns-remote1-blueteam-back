import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    firstname: 'Alice',
    lastname: 'Wonderland',
    email: 'alice@prisma.io',
    job: 'Software Engineer',
    password: 'password',
  },
  {
    firstname: 'John',
    lastname: 'Wick',
    email: 'john@prisma.io',
    job: 'Killer',
    password: 'azerty',
  },
];

async function main() {
  console.log(`Start seeding ...`);
  const userCreatePromises = userData.map((u) =>
    prisma.user.create({
      data: u,
    })
  );

  const users = await Promise.all(userCreatePromises);
  console.log('Seeding finished with', users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    id: 'aStudent', // Optional: specify if you want a specific ID
    name: 'Amy',
    email: 'amyStudent@unc.edu',
    password: 'password', // Plaintext password, will be hashed
    // No need to specify createdAt and updatedAt
  },
];

async function main() {
  console.log(`Start seeding ...`);
  console.log(`Database URL: ${process.env.DATABASE_URL}`); // Debugging

  for (const u of userData) {
    try {
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(u.password, 10);

      const user = await prisma.user.create({
        data: {
          ...u,
          password: hashedPassword,
        },
      });

      console.log(`Created user with id: ${user.id}`);
    } catch (error) {
      console.error(`Error creating user with email ${u.email}:`, error);
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

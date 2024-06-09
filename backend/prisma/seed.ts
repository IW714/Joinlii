import {PrismaClient, Prisma} from '@prisma/client'

const prisma = new PrismaClient() 

const userData: Prisma.UserCreateInput[] = [
    {
        name: 'Amy', 
        email: 'amyStudent@unc.edu',
        id: "aStudent", 
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
    }
]

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
      try {
          const user = await prisma.user.create({
              data: u,
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

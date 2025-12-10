import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter }).$extends({
    // GLOBAL MIDDLEWARE TO REMOVE PASSWORD
    // result: {
    //   user: {
    //     password: {
    //       needs: {},
    //       compute() {
    //         return undefined; // hide globally
    //       }
    //     }
    //     }
    // }
  });
  
export { prisma };
//# sourceMappingURL=prisma.js.map
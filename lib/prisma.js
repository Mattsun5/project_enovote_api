import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const globalForPrisma = globalThis;
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = globalForPrisma.prisma || new PrismaClient({ 
  adapter, 
  // GLOBAL MIDDLEWARE TO REMOVE PASSWORD
  omit: {
        user: {
          password: true
        }
    } }).$extends({
    // GLOBAL MIDDLEWARE TO REMOVE PASSWORD
    // result: {
    //   user: {
    //     password: {
    //       needs: {},
    //       compute() {
    //         return undefined; // hide globally
    //       }
    //     }
    //   }
    // },
  });
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
// prisma
  
export { prisma };
//# sourceMappingURL=prisma.js.map
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../../generated/prisma/client";

export const createCoreDb = (connectionString: string) => {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return { db: new PrismaClient({ adapter }), pool };
};

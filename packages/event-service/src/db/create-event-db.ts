import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export const createEventDb = (connectionString: string) => {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return { db: new PrismaClient({ adapter }), pool };
};

import { PrismaPg } from "@prisma/adapter-pg";
// @ts-ignore -- pg runtime is available in consumers; tsconfig/module resolution misses declarations here.
import { Pool } from "pg";

type PrismaClientCtor<TClient> = new (options: { adapter: PrismaPg }) => TClient;

export const createPrismaDb = <TClient>(
  connectionString: string,
  PrismaClient: PrismaClientCtor<TClient>,
) => {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return { db: new PrismaClient({ adapter }), pool };
};

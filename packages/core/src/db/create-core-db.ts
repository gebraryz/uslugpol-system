import { createPrismaDb } from "@uslugpol/shared/db";
import { PrismaClient } from "../../generated/prisma/client";

export const createCoreDb = (connectionString: string) =>
  createPrismaDb(connectionString, PrismaClient);

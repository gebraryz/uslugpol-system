import { PrismaClient } from "../../generated/prisma/client";
import { createPrismaDb } from "@uslugpol/shared/db";

export const createEventDb = (connectionString: string) =>
  createPrismaDb(connectionString, PrismaClient);

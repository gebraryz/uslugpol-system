import { PrismaClient } from "../../generated/prisma/client";
import { createPrismaDb } from "@uslugpol/shared/db";

export const createCarDb = (connectionString: string) =>
  createPrismaDb(connectionString, PrismaClient);

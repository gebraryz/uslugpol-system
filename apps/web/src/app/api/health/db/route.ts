import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const GET = async () => {
  const { core, event, car } = getDb();

  await core.$queryRaw`SELECT 1`;
  await event.$queryRaw`SELECT 1`;
  await car.$queryRaw`SELECT 1`;

  return NextResponse.json({ ok: true });
};

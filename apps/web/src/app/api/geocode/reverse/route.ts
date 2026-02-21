import { getReverseGeocode } from "@/lib/geocode";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);

  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      {
        error: "Nieprawidłowe współrzędne",
        shortLabel: null,
        secondaryLabel: null,
        fullLabel: null,
      },
      { status: 400 },
    );
  }

  try {
    const result = await getReverseGeocode(lat, lng);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        error: "Wystąpił błąd podczas określania lokalizacji",
        shortLabel: null,
        secondaryLabel: null,
        fullLabel: null,
      },
      { status: 502 },
    );
  }
};

import { ReverseGeocodePayload } from "@/types/geocode";
import { unstable_cache } from "next/cache";

interface GeocodingData {
  label?: string;
  name?: string;
  housenumber?: string;
  street?: string;
  locality?: string;
  district?: string;
  postcode?: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
}

interface NominatimReverseResponse {
  features?: Array<{ properties?: { geocoding?: GeocodingData } }>;
}

const uniqueParts = (...parts: (string | undefined)[]) =>
  [...new Set(parts.map((part) => part?.trim()).filter(Boolean))] as string[];

const buildUiLabels = (
  geocoding: GeocodingData = {},
): ReverseGeocodePayload => {
  const {
    street,
    housenumber,
    name,
    locality,
    district,
    city,
    postcode,
    label,
  } = geocoding;

  const streetAndHouse = uniqueParts(street, housenumber).join(" ");
  const shortLabel =
    streetAndHouse || uniqueParts(name, locality, district, city)[0] || null;
  const secondaryLabel =
    uniqueParts(district, locality, city, postcode)
      .filter((part) => part !== shortLabel)
      .join(", ") || null;

  return { shortLabel, secondaryLabel, fullLabel: label?.trim() || null };
};

const reverseGeocodeCached = unstable_cache(
  async (
    lat: number,
    lng: number,
    language: string,
  ): Promise<ReverseGeocodePayload> => {
    const params = new URLSearchParams({
      format: "geocodejson",
      lat: String(lat),
      lon: String(lng),
      addressdetails: "1",
      "accept-language": language,
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      { headers: { "User-Agent": "uslugpol-system-recruitment-task/1.0" } },
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.status}`);
    }

    const payload = (await response.json()) as NominatimReverseResponse;
    const geocoding = payload.features?.[0]?.properties?.geocoding;

    return buildUiLabels(geocoding);
  },
  ["reverse-geocode-v2"],
  { revalidate: 60 * 60 * 24 * 30 }, // 30 days
);

export const getReverseGeocode = (lat: number, lng: number) =>
  reverseGeocodeCached(
    Number(lat.toFixed(5)),
    Number(lng.toFixed(5)),
    ["pl", "en"].join(","),
  );

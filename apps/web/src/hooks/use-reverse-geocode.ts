"use client";

import { ReverseGeocodePayload } from "@/types/geocode";
import { useMemo } from "react";
import useSWR from "swr";

const buildCacheKey = (lat: number, lng: number) =>
  `${lat.toFixed(5)}:${lng.toFixed(5)}`;

const fetcher = async (url: string): Promise<ReverseGeocodePayload | null> => {
  const response = await fetch(url);

  if (!response.ok) return null;

  return (await response.json()) as ReverseGeocodePayload;
};

interface UseReverseGeocodeResult {
  location: ReverseGeocodePayload | null;
  isLoading: boolean;
}

export const useReverseGeocode = (
  lat: number,
  lng: number,
  enabled = true,
): UseReverseGeocodeResult => {
  const key = useMemo(() => {
    if (!enabled) return null;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    const cacheKey = buildCacheKey(lat, lng);
    return [`/api/geocode/reverse?lat=${lat}&lng=${lng}`, cacheKey] as const;
  }, [enabled, lat, lng]);

  const { data, error, isLoading } = useSWR(
    key ? key[1] : null,
    () => fetcher(key![0]),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10_000,
      shouldRetryOnError: false,
    },
  );

  return {
    location: data ?? null,
    isLoading: data === undefined && !error && isLoading,
  };
};

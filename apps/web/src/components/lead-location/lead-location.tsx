"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useReverseGeocode } from "@/hooks/use-reverse-geocode";
import dynamic from "next/dynamic";

const LeadLocationMap = dynamic(
  () =>
    import("./lead-location-map").then(
      ({ LeadLocationMap }) => LeadLocationMap,
    ),
  { ssr: false, loading: () => <Skeleton className="h-64 w-full" /> },
);

interface LeadLocationProps {
  lat: number;
  lng: number;
}

export const LeadLocation = ({ lat, lng }: LeadLocationProps) => {
  const { location, isLoading } = useReverseGeocode(lat, lng);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <LeadLocationMap lat={lat} lng={lng} />
      <div className="space-y-3 rounded-lg border p-4">
        <div>
          <p className="text-muted-foreground text-sm">
            Szerokość geograficzna
          </p>
          <p className="font-medium">{lat.toFixed(6)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Długość geograficzna</p>
          <p className="font-medium">{lng.toFixed(6)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Lokalizacja (UI)</p>
          {isLoading ? (
            <p className="text-sm">Ładowanie...</p>
          ) : (
            <div className="space-y-1">
              <p className="font-medium">
                {location?.shortLabel ??
                  `Współrzędne: ${lat.toFixed(5)}, ${lng.toFixed(5)}`}
              </p>
              {(location?.secondaryLabel ?? location?.fullLabel) && (
                <p className="text-muted-foreground text-sm">
                  {location?.secondaryLabel ?? location?.fullLabel}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

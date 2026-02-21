"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useReverseGeocode } from "@/hooks/use-reverse-geocode";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const LeadLocationPreviewMap = dynamic(
  () =>
    import("./lead-location-preview-map").then(
      ({ LeadLocationPreviewMap }) => LeadLocationPreviewMap,
    ),
  { ssr: false, loading: () => <Skeleton className="h-85" /> },
);

interface LeadLocationPreviewProps {
  lat: number;
  lng: number;
  showLabel?: boolean;
}

export const LeadLocationPreview = ({
  lat,
  lng,
  showLabel = false,
}: LeadLocationPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { location, isLoading } = useReverseGeocode(
    lat,
    lng,
    isOpen || showLabel,
  );

  const fallback = `Współrzędne: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className="max-w-xs truncate text-sm">
          {isLoading ? "Ładowanie..." : (location?.shortLabel ?? fallback)}
        </span>
      )}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <MapPin />
            Podgląd
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Lokalizacja leada</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Ładowanie adresu...</p>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {location?.shortLabel ?? fallback}
              </p>
              {(location?.secondaryLabel ?? location?.fullLabel) && (
                <p className="text-muted-foreground text-sm">
                  {location?.secondaryLabel ?? location?.fullLabel}
                </p>
              )}
            </div>
          )}
          <LeadLocationPreviewMap lat={lat} lng={lng} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

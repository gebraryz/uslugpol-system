"use client";

import "leaflet-defaulticon-compatibility";
import { useMemo } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import type { LatLngLiteral } from "leaflet";

interface LeadLocationDialogPreviewMapProps {
  lat: number;
  lng: number;
}

export const LeadLocationDialogPreviewMap = ({
  lat,
  lng,
}: LeadLocationDialogPreviewMapProps) => {
  const center = useMemo<LatLngLiteral>(() => ({ lat, lng }), [lat, lng]);

  return (
    <div className="h-85 w-full overflow-hidden rounded-lg border">
      <MapContainer
        center={center}
        className="size-full"
        zoom={15}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} />
      </MapContainer>
    </div>
  );
};

"use client";

import type { LatLngLiteral } from "leaflet";
import { useMemo } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet-defaulticon-compatibility";

interface LeadDetailsLocationMapProps {
  lat: number;
  lng: number;
}

export const LeadDetailsLocationMap = ({
  lat,
  lng,
}: LeadDetailsLocationMapProps) => {
  const center = useMemo<LatLngLiteral>(() => ({ lat, lng }), [lat, lng]);

  return (
    <div className="h-64 w-full overflow-hidden rounded-lg border">
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

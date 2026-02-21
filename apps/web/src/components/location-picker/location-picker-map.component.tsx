"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type {
  LatLngLiteral,
  LeafletMouseEvent,
  Marker as LeafletMarker,
} from "leaflet";
import "leaflet-defaulticon-compatibility";
import {
  LocationPickerProps,
  LocationPickerValue,
} from "./location-picker.types";

interface FlyToOnPickProps {
  onPick: (v: LatLngLiteral) => void;
}

const FlyToOnPick = ({ onPick }: FlyToOnPickProps) => {
  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      onPick(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return null;
};

interface SetViewWhenExternalValueChangesProps {
  center: LatLngLiteral;
}

const SetViewWhenExternalValueChanges = ({
  center,
}: SetViewWhenExternalValueChangesProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
};

export const LocationPickerMap = ({
  value = null,
  defaultCenter = { lat: 52.2297, lng: 21.0122 },
  zoom = 13,
  className,
  style,
  draggableMarker = true,
  onChange,
}: LocationPickerProps) => {
  const [internal, setInternal] = useState<LocationPickerValue | null>(value);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  const center = useMemo<LatLngLiteral>(() => {
    return (internal ?? defaultCenter) as LatLngLiteral;
  }, [internal, defaultCenter]);

  const pick = useCallback(
    (latlng: LatLngLiteral) => {
      const next = { lat: latlng.lat, lng: latlng.lng };

      setInternal(next);
      onChange(next);
    },
    [onChange],
  );

  return (
    <div
      className={className ?? "w-full overflow-hidden rounded-xl"}
      style={{ height: 340, ...style }}
    >
      <MapContainer
        center={center}
        className="size-full"
        zoom={zoom}
        scrollWheelZoom
      >
        <SetViewWhenExternalValueChanges center={center} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToOnPick onPick={pick} />

        {internal && (
          <Marker
            position={internal}
            draggable={draggableMarker}
            eventHandlers={
              draggableMarker
                ? {
                    dragend: (event) => {
                      const marker = event.target as LeafletMarker;
                      pick(marker.getLatLng());
                    },
                  }
                : undefined
            }
          />
        )}
      </MapContainer>
    </div>
  );
};

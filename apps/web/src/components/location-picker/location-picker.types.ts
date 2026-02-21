import { CSSProperties } from "react";

export interface LocationPickerValue {
  lat: number;
  lng: number;
}

export interface LocationPickerProps {
  value?: LocationPickerValue | null;
  defaultCenter?: LocationPickerValue;
  zoom?: number;
  draggableMarker?: boolean;
  style?: CSSProperties;
  className?: string;
  onChange: (v: LocationPickerValue) => void;
}

"use client";

import dynamic from "next/dynamic";
import { LocationPickerProps } from "./location-picker.types";
import { Skeleton } from "../ui/skeleton";

const LocationPickerMap = dynamic(
  () =>
    import("./location-picker-map.component").then(
      ({ LocationPickerMap }) => LocationPickerMap,
    ),
  { ssr: false, loading: () => <Skeleton className="h-85" /> },
);

export const LocationPicker = (props: LocationPickerProps) => (
  <LocationPickerMap {...props} />
);

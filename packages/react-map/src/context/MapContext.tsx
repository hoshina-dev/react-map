"use client";

import type maplibregl from "maplibre-gl";
import { createContext, useContext } from "react";

interface MapContextValue {
  map: maplibregl.Map | null;
}

const MapContext = createContext<MapContextValue | null>(null);

export function useMap(): maplibregl.Map | null {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error("useMap must be used within a Map component");
  }

  return context.map;
}

export const MapProvider = MapContext.Provider;

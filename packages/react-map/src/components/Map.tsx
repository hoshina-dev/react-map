"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { Box, MantineStyleProp } from "@mantine/core";
import maplibregl from "maplibre-gl";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { MapProvider } from "../context/MapContext";

interface MapProps {
  children?: ReactNode;
  style?: MantineStyleProp;
}

export function Map({ children, style }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  // Initialize map
  useEffect(() => {
    if (map || !mapContainer.current) return;

    const newMap = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          carto: {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
              "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
              "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors &copy; CARTO",
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: "carto",
            type: "raster",
            source: "carto",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [0, 20],
      zoom: 1.5,
    });

    setMap(newMap);

    return () => {
      newMap.remove();
      setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box style={{ flex: 1, position: "relative", ...style }}>
      <Box ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <MapProvider value={{ map }}>{map && children}</MapProvider>
    </Box>
  );
}

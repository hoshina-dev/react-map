"use client";

import { useMap } from "@hoshina/react-map";
import type { Geometry } from "geojson";
import maplibregl from "maplibre-gl";
import { useEffect } from "react";

interface ClickHandlerProps {
  currentLevel: number;
  onGeometryClick: (
    areaCode: string,
    areaName: string,
    geometry: Geometry,
  ) => void;
  onZoomOut: () => void;
  layerId?: string;
}

export function ClickHandler({
  currentLevel,
  onGeometryClick,
  onZoomOut,
  layerId = "admin-boundaries",
}: ClickHandlerProps) {
  const map = useMap();
  const fillLayerId = `${layerId}-fill`;

  // Handle click to drill down
  useEffect(() => {
    if (!map) return;

    const handleClick = (e: maplibregl.MapLayerMouseEvent) => {
      // Ignore clicks on markers
      const target = e.originalEvent.target as HTMLElement;
      if (target.closest('[data-marker="true"]')) {
        return;
      }

      if (!e.features || e.features.length === 0) return;

      const feature = e.features[0];
      if (!feature) return;

      const properties = feature.properties;
      const geometry = feature.geometry;

      const areaCode = properties?.isoCode || properties?.id;
      const areaName = properties?.name || areaCode;

      onGeometryClick(areaCode, areaName, geometry);

      // Zoom to clicked feature
      if (geometry) {
        const bounds = new maplibregl.LngLatBounds();

        if (geometry.type === "Polygon") {
          const polygonGeometry = geometry as {
            type: "Polygon";
            coordinates: number[][][];
          };
          polygonGeometry.coordinates.forEach((ring) => {
            ring.forEach((coord) => {
              bounds.extend(coord as [number, number]);
            });
          });
        } else if (geometry.type === "MultiPolygon") {
          const multiPolygonGeometry = geometry as {
            type: "MultiPolygon";
            coordinates: number[][][][];
          };
          multiPolygonGeometry.coordinates.forEach((polygon) => {
            polygon.forEach((ring) => {
              ring.forEach((coord) => {
                bounds.extend(coord as [number, number]);
              });
            });
          });
        }

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 50, duration: 1000 });
        }
      }
    };

    map.on("click", fillLayerId, handleClick);

    return () => {
      map.off("click", fillLayerId, handleClick);
    };
  }, [map, currentLevel, onGeometryClick, fillLayerId]);

  // Handle right-click to zoom out
  useEffect(() => {
    if (!map) return;

    const handleContextMenu = (e: maplibregl.MapMouseEvent) => {
      e.preventDefault();

      if (currentLevel > 0) {
        onZoomOut();

        // Zoom out to world view if going back to level 0
        if (currentLevel === 1) {
          map.flyTo({ center: [0, 20], zoom: 1.5, duration: 1000 });
        }
      }
    };

    map.on("contextmenu", handleContextMenu);

    return () => {
      map.off("contextmenu", handleContextMenu);
    };
  }, [map, currentLevel, onZoomOut]);

  return null;
}

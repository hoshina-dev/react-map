import type { Geometry } from "geojson";
import maplibregl from "maplibre-gl";
import { RefObject, useEffect } from "react";

export function useSetupClick(
  map: RefObject<maplibregl.Map | null>,
  currentLevel: number,
  onGeometryClick: (
    areaCode: string,
    areaName: string,
    geometry: Geometry,
  ) => void,
  onZoomOut: () => void,
) {
  useEffect(() => {
    if (!map.current) return;

    const handleClick = (e: maplibregl.MapLayerMouseEvent) => {
      if (!e.features || e.features.length === 0) return;

      const feature = e.features[0];
      if (!feature) return;

      const properties = feature.properties;
      const geometry = feature.geometry;

      if (currentLevel < 4) {
        const areaCode = properties?.isoCode || properties?.id;
        const areaName = properties?.name || areaCode;

        onGeometryClick(areaCode, areaName, geometry);

        // Zoom to clicked feature
        if (geometry && map.current) {
          const bounds = new maplibregl.LngLatBounds();

          if (geometry.type === "Polygon") {
            const polygonGeometry = geometry;
            polygonGeometry.coordinates.forEach((ring) => {
              ring.forEach((coord) => {
                bounds.extend(coord as [number, number]);
              });
            });
          } else if (geometry.type === "MultiPolygon") {
            const multiPolygonGeometry = geometry;
            multiPolygonGeometry.coordinates.forEach((polygon) => {
              polygon.forEach((ring) => {
                ring.forEach((coord) => {
                  bounds.extend(coord as [number, number]);
                });
              });
            });
          }

          if (!bounds.isEmpty()) {
            map.current.fitBounds(bounds, { padding: 50, duration: 1000 });
          }
        }
      }
    };

    const fillLayerId = "admin-fill";
    map.current.on("click", fillLayerId, handleClick);

    const mapRef = map.current;

    return () => {
      mapRef.off("click", fillLayerId, handleClick);
    };
  }, [currentLevel, map, onGeometryClick]);

  // Handle right-click to zoom out
  useEffect(() => {
    if (!map.current) return;

    const handleContextMenu = (e: maplibregl.MapMouseEvent) => {
      e.preventDefault();

      if (currentLevel > 0) {
        onZoomOut();

        // Zoom out to world view if going back to level 0
        if (currentLevel === 1) {
          map.current?.flyTo({ center: [0, 20], zoom: 1.5, duration: 1000 });
        }
      }
    };

    map.current.on("contextmenu", handleContextMenu);

    const mapRef = map.current;

    return () => {
      mapRef.off("contextmenu", handleContextMenu);
    };
  }, [currentLevel, map, onZoomOut]);
}

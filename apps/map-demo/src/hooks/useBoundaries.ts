import { MapLevelStyle } from "@hoshina/react-map";
import type { FeatureCollection as GeoJsonFeatureCollection } from "geojson";
import maplibregl from "maplibre-gl";
import { RefObject, useEffect } from "react";

export function useBoundaries(
  map: RefObject<maplibregl.Map | null>,
  currentData: GeoJsonFeatureCollection | null,
  levelStyle: MapLevelStyle,
) {
  useEffect(() => {
    if (!map.current) return;

    if (!currentData || currentData.features.length === 0) {
      return;
    }

    const sourceId = "admin-boundaries";
    const fillLayerId = "admin-fill";
    const outlineLayerId = "admin-outline";

    // Remove existing layers and source
    if (map.current.getLayer(fillLayerId)) {
      map.current.removeLayer(fillLayerId);
    }
    if (map.current.getLayer(outlineLayerId)) {
      map.current.removeLayer(outlineLayerId);
    }
    if (map.current.getSource(sourceId)) {
      map.current.removeSource(sourceId);
    }

    // Add new source
    map.current.addSource(sourceId, {
      type: "geojson",
      data: currentData,
    });

    // Add fill layer
    map.current.addLayer({
      id: fillLayerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": levelStyle.fillColor,
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },
    });

    // Add outline layer
    map.current.addLayer({
      id: outlineLayerId,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": levelStyle.lineColor,
        "line-width": levelStyle.lineWidth,
      },
    });

    // Setup hover effects
    map.current.on("mouseenter", fillLayerId, () => {
      if (map.current) map.current.getCanvas().style.cursor = "pointer";
    });

    map.current.on("mouseleave", fillLayerId, () => {
      if (map.current) map.current.getCanvas().style.cursor = "";
    });

    let hoveredFeatureId: string | number | undefined = undefined;
    map.current.on("mousemove", fillLayerId, (e) => {
      if (e.features && e.features.length > 0) {
        if (hoveredFeatureId !== undefined) {
          map.current?.setFeatureState(
            { source: sourceId, id: hoveredFeatureId },
            { hover: false },
          );
        }
        const featureId = e.features[0]?.id;
        if (featureId !== undefined) {
          hoveredFeatureId = featureId;
          map.current?.setFeatureState(
            { source: sourceId, id: hoveredFeatureId },
            { hover: true },
          );
        }
      }
    });

    map.current.on("mouseleave", fillLayerId, () => {
      if (hoveredFeatureId !== undefined) {
        map.current?.setFeatureState(
          { source: sourceId, id: hoveredFeatureId },
          { hover: false },
        );
      }
      hoveredFeatureId = undefined;
    });
  }, [
    map,
    currentData,
    levelStyle.fillColor,
    levelStyle.lineColor,
    levelStyle.lineWidth,
  ]);
}

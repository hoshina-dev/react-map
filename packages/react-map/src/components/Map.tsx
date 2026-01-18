"use client";

import type { MapLevelStyle } from "@hoshina/react-map";
import {
  Badge,
  Box,
  Button,
  MantineProvider,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type {
  FeatureCollection as GeoJsonFeatureCollection,
  Geometry,
} from "geojson";
import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

interface MapProps {
  currentLevel: number;
  currentData: GeoJsonFeatureCollection | null;
  levelStyle: MapLevelStyle;
  onGeometryClick: (
    areaCode: string,
    areaName: string,
    geometry: Geometry,
  ) => void;
  onZoomOut: () => void;
}

export function Map({
  currentLevel,
  currentData,
  levelStyle,
  onGeometryClick,
  onZoomOut,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
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

    // Add a marker at coordinates (0, 0) with a popup
    const popupNode = document.createElement("div");

    // Create a React component for the popup content
    const PopupContent = () => (
      <MantineProvider>
        <Stack gap="xs" p="sm">
          <Title order={4}>Special Location</Title>
          <Text size="sm">Coordinates: (0, 0)</Text>
          <Badge color="blue" variant="filled">
            Null Island
          </Badge>
          <Text size="xs" c="dimmed">
            This is the intersection of the Prime Meridian and the Equator
          </Text>
          <Button size="xs" variant="light" fullWidth>
            Learn More
          </Button>
        </Stack>
      </MantineProvider>
    );

    const root = createRoot(popupNode);
    root.render(<PopupContent />);

    const popup = new maplibregl.Popup({ offset: 25 }).setDOMContent(popupNode);

    new maplibregl.Marker({ color: "#FF0000" })
      .setLngLat([0, 0])
      .setPopup(popup)
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update boundaries when data changes
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
    currentData,
    currentLevel,
    levelStyle.fillColor,
    levelStyle.lineColor,
    levelStyle.lineWidth,
  ]);

  // Handle click to drill down
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

    return () => {
      map.current?.off("click", fillLayerId, handleClick);
    };
  }, [currentLevel, onGeometryClick]);

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

    return () => {
      map.current?.off("contextmenu", handleContextMenu);
    };
  }, [currentLevel, onZoomOut]);

  return (
    <Box style={{ flex: 1, position: "relative" }}>
      <Box ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </Box>
  );
}

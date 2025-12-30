"use client";

import type {
  FillLayerSpecification,
  LineLayerSpecification,
} from "maplibre-gl";
import { useMemo } from "react";
import { Layer, Source } from "react-map-gl/maplibre";

import type { GeoJSONFeatureCollection, LayerVariant } from "../core/types";

interface GeoLayerProps {
  id: string;
  data: GeoJSONFeatureCollection;
  variant?: LayerVariant;
  highlightedFeature?: string | null;
  selectedFeature?: string | null;
}

// Color schemes for different layer variants
const LAYER_COLORS = {
  country: {
    fill: "#4dabf7",
    fillOpacity: 0.3,
    stroke: "#1971c2",
    strokeWidth: 1,
    highlightFill: "#228be6",
    highlightOpacity: 0.6,
    selectedFill: "#1971c2",
    selectedOpacity: 0.8,
  },
  default: {
    fill: "#69db7c",
    fillOpacity: 0.3,
    stroke: "#2f9e44",
    strokeWidth: 1,
    highlightFill: "#40c057",
    highlightOpacity: 0.6,
    selectedFill: "#2f9e44",
    selectedOpacity: 0.8,
  },
} as const;

export function GeoLayer({
  id,
  data,
  variant = "default",
  highlightedFeature,
  selectedFeature,
}: GeoLayerProps) {
  const colors = LAYER_COLORS[variant];

  // Create the fill paint expression based on highlighted and selected features
  const fillPaint = useMemo<FillLayerSpecification["paint"]>(
    () => ({
      "fill-color": selectedFeature
        ? [
            "case",
            ["==", ["get", "name"], selectedFeature],
            colors.selectedFill,
            highlightedFeature
              ? [
                  "case",
                  ["==", ["get", "name"], highlightedFeature],
                  colors.highlightFill,
                  colors.fill,
                ]
              : colors.fill,
          ]
        : highlightedFeature
          ? [
              "case",
              ["==", ["get", "name"], highlightedFeature],
              colors.highlightFill,
              colors.fill,
            ]
          : colors.fill,
      "fill-opacity": selectedFeature
        ? [
            "case",
            ["==", ["get", "name"], selectedFeature],
            colors.selectedOpacity,
            highlightedFeature
              ? [
                  "case",
                  ["==", ["get", "name"], highlightedFeature],
                  colors.highlightOpacity,
                  colors.fillOpacity,
                ]
              : colors.fillOpacity,
          ]
        : highlightedFeature
          ? [
              "case",
              ["==", ["get", "name"], highlightedFeature],
              colors.highlightOpacity,
              colors.fillOpacity,
            ]
          : colors.fillOpacity,
    }),
    [highlightedFeature, selectedFeature, colors],
  );

  const linePaint = useMemo<LineLayerSpecification["paint"]>(
    () => ({
      "line-color": colors.stroke,
      "line-width": selectedFeature
        ? [
            "case",
            ["==", ["get", "name"], selectedFeature],
            3,
            highlightedFeature
              ? [
                  "case",
                  ["==", ["get", "name"], highlightedFeature],
                  2,
                  colors.strokeWidth,
                ]
              : colors.strokeWidth,
          ]
        : highlightedFeature
          ? [
              "case",
              ["==", ["get", "name"], highlightedFeature],
              2,
              colors.strokeWidth,
            ]
          : colors.strokeWidth,
    }),
    [highlightedFeature, selectedFeature, colors],
  );

  // Cast to GeoJSON for react-map-gl Source
  const geoJsonData = data as GeoJSON.FeatureCollection;

  return (
    <Source id={id} type="geojson" data={geoJsonData}>
      {/* Fill layer */}
      <Layer id={`${id}-fill`} type="fill" paint={fillPaint} />
      {/* Outline layer */}
      <Layer id={`${id}-line`} type="line" paint={linePaint} />
    </Source>
  );
}

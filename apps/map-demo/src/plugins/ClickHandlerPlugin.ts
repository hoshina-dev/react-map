import { MapPlugin } from "@hoshina/react-map";
import type { Geometry } from "geojson";
import maplibregl from "maplibre-gl";

export class ClickHandlerPlugin implements MapPlugin {
  private map: maplibregl.Map | null = null;
  private readonly fillLayerId: string;

  // Event handlers stored as class properties for cleanup
  private onClick: (e: maplibregl.MapLayerMouseEvent) => void;
  private onContextMenu: (e: maplibregl.MapMouseEvent) => void;

  constructor(
    private currentLevel: number,
    private onGeometryClick: (
      areaCode: string,
      areaName: string,
      geometry: Geometry,
    ) => void,
    private onZoomOut: () => void,
    layerId = "admin-boundaries",
  ) {
    this.fillLayerId = `${layerId}-fill`;

    // Bind click handler
    this.onClick = (e: maplibregl.MapLayerMouseEvent) => {
      if (!e.features || e.features.length === 0) return;

      const feature = e.features[0];
      if (!feature) return;

      const properties = feature.properties;
      const geometry = feature.geometry;

      if (this.currentLevel < 4) {
        const areaCode = properties?.isoCode || properties?.id;
        const areaName = properties?.name || areaCode;

        this.onGeometryClick(areaCode, areaName, geometry);

        // Zoom to clicked feature
        if (geometry && this.map) {
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
            this.map.fitBounds(bounds, { padding: 50, duration: 1000 });
          }
        }
      }
    };

    // Bind context menu handler
    this.onContextMenu = (e: maplibregl.MapMouseEvent) => {
      e.preventDefault();

      if (this.currentLevel > 0) {
        this.onZoomOut();

        // Zoom out to world view if going back to level 0
        if (this.currentLevel === 1) {
          this.map?.flyTo({ center: [0, 20], zoom: 1.5, duration: 1000 });
        }
      }
    };
  }

  initialize(map: maplibregl.Map): void {
    this.map = map;

    // Attach event listeners
    map.on("click", this.fillLayerId, this.onClick);
    map.on("contextmenu", this.onContextMenu);
  }

  cleanup(): void {
    if (!this.map) return;

    // Remove event listeners
    this.map.off("click", this.fillLayerId, this.onClick);
    this.map.off("contextmenu", this.onContextMenu);

    this.map = null;
  }
}

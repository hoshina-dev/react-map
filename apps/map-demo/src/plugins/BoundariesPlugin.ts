import { MapLevelStyle, MapPlugin } from "@hoshina/react-map";
import type { FeatureCollection as GeoJsonFeatureCollection } from "geojson";
import maplibregl from "maplibre-gl";

export class BoundariesPlugin implements MapPlugin {
  private map: maplibregl.Map | null = null;
  private hoveredFeatureId: string | number | undefined = undefined;
  private readonly sourceId: string;
  private readonly fillLayerId: string;
  private readonly outlineLayerId: string;

  // Event handlers stored as class properties for cleanup
  private onMouseEnter: () => void;
  private onMouseLeave: () => void;
  private onMouseMove: (e: maplibregl.MapLayerMouseEvent) => void;
  private onMouseLeaveForHover: () => void;

  constructor(
    private currentData: GeoJsonFeatureCollection | null,
    private levelStyle: MapLevelStyle,
    layerId = "admin-boundaries",
  ) {
    this.sourceId = layerId;
    this.fillLayerId = `${layerId}-fill`;
    this.outlineLayerId = `${layerId}-outline`;

    // Bind event handlers
    this.onMouseEnter = () => {
      if (this.map) this.map.getCanvas().style.cursor = "pointer";
    };

    this.onMouseLeave = () => {
      if (this.map) this.map.getCanvas().style.cursor = "";
    };

    this.onMouseMove = (e: maplibregl.MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0) {
        if (this.hoveredFeatureId !== undefined) {
          this.map?.setFeatureState(
            { source: this.sourceId, id: this.hoveredFeatureId },
            { hover: false },
          );
        }
        const featureId = e.features[0]?.id;
        if (featureId !== undefined) {
          this.hoveredFeatureId = featureId;
          this.map?.setFeatureState(
            { source: this.sourceId, id: this.hoveredFeatureId },
            { hover: true },
          );
        }
      }
    };

    this.onMouseLeaveForHover = () => {
      if (this.hoveredFeatureId !== undefined) {
        this.map?.setFeatureState(
          { source: this.sourceId, id: this.hoveredFeatureId },
          { hover: false },
        );
      }
      this.hoveredFeatureId = undefined;
    };
  }

  initialize(map: maplibregl.Map): void {
    this.map = map;

    if (!this.currentData || this.currentData.features.length === 0) {
      return;
    }

    // Remove existing layers and source if they exist
    if (map.getLayer(this.fillLayerId)) {
      map.removeLayer(this.fillLayerId);
    }
    if (map.getLayer(this.outlineLayerId)) {
      map.removeLayer(this.outlineLayerId);
    }
    if (map.getSource(this.sourceId)) {
      map.removeSource(this.sourceId);
    }

    // Add new source
    map.addSource(this.sourceId, {
      type: "geojson",
      data: this.currentData,
    });

    // Add fill layer
    map.addLayer({
      id: this.fillLayerId,
      type: "fill",
      source: this.sourceId,
      paint: {
        "fill-color": this.levelStyle.fillColor,
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },
    });

    // Add outline layer
    map.addLayer({
      id: this.outlineLayerId,
      type: "line",
      source: this.sourceId,
      paint: {
        "line-color": this.levelStyle.lineColor,
        "line-width": this.levelStyle.lineWidth,
      },
    });

    // Setup hover effects
    map.on("mouseenter", this.fillLayerId, this.onMouseEnter);
    map.on("mouseleave", this.fillLayerId, this.onMouseLeave);
    map.on("mousemove", this.fillLayerId, this.onMouseMove);
    map.on("mouseleave", this.fillLayerId, this.onMouseLeaveForHover);
  }

  cleanup(): void {
    if (!this.map) return;

    // Remove event listeners
    this.map.off("mouseenter", this.fillLayerId, this.onMouseEnter);
    this.map.off("mouseleave", this.fillLayerId, this.onMouseLeave);
    this.map.off("mousemove", this.fillLayerId, this.onMouseMove);
    this.map.off("mouseleave", this.fillLayerId, this.onMouseLeaveForHover);

    // Remove layers and source
    if (this.map.getLayer(this.fillLayerId)) {
      this.map.removeLayer(this.fillLayerId);
    }
    if (this.map.getLayer(this.outlineLayerId)) {
      this.map.removeLayer(this.outlineLayerId);
    }
    if (this.map.getSource(this.sourceId)) {
      this.map.removeSource(this.sourceId);
    }

    this.map = null;
    this.hoveredFeatureId = undefined;
  }
}

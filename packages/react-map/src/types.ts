import type maplibregl from "maplibre-gl";

export interface MapLevelStyle {
  fillColor: string;
  lineColor: string;
  lineWidth: number;
}

export interface MapPlugin {
  /**
   * Called when the plugin is initialized with a map instance
   * @param map - The MapLibre GL map instance
   */
  initialize(map: maplibregl.Map): void;

  /**
   * Called when the plugin should clean up resources
   */
  cleanup(): void;
}

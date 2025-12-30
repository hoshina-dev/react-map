// GeoJSON Types for Map Components

export interface GeoJSONGeometry {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}

export interface CountryProperties {
  name: string;
  isoCode?: string;
  [key: string]: unknown;
}

export interface GeoJSONFeature {
  type: "Feature";
  id: string | number;
  geometry: GeoJSONGeometry;
  properties: CountryProperties;
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export interface FocusedEntity {
  name: string;
  level: number;
  isoCode?: string;
}

export type LayerVariant = "country" | "default";

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

export const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 0,
  latitude: 20,
  zoom: 1.5,
};

export interface SelectedFeature {
  name: string;
  isoCode?: string;
  level: number;
}

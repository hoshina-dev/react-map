// Geo utilities for handling antimeridian crossing and coordinate fixes
import type { GeoJSONFeatureCollection, GeoJSONGeometry } from "./types";

/**
 * Checks if a ring of coordinates crosses the antimeridian (±180° longitude)
 */
function ringCrossesAntimeridian(ring: number[][]): boolean {
  for (let i = 0; i < ring.length - 1; i++) {
    const lon1 = ring[i]![0]!;
    const lon2 = ring[i + 1]![0]!;
    // If the absolute difference is greater than 180, it crosses the antimeridian
    if (Math.abs(lon2 - lon1) > 180) {
      return true;
    }
  }
  return false;
}

/**
 * Shifts coordinates that are on the "wrong side" of the antimeridian
 * to create a continuous polygon (used for features like Russia, Fiji)
 */
function fixRingCoordinates(ring: number[][], shiftRight: boolean): number[][] {
  return ring.map((coord) => {
    const lon = coord[0]!;
    const lat = coord[1]!;

    if (shiftRight && lon < 0) {
      return [lon + 360, lat, ...coord.slice(2)];
    } else if (!shiftRight && lon > 0) {
      return [lon - 360, lat, ...coord.slice(2)];
    }
    return coord;
  });
}

/**
 * Fixes a single geometry that crosses the antimeridian
 */
function fixGeometry(geometry: GeoJSONGeometry): GeoJSONGeometry {
  if (geometry.type === "Polygon") {
    const rings = geometry.coordinates as number[][][];
    const needsFix = rings.some((ring) => ringCrossesAntimeridian(ring));

    if (!needsFix) return geometry;

    // Determine shift direction based on the first ring's center
    const firstRing = rings[0]!;
    const avgLon =
      firstRing.reduce((sum, coord) => sum + coord[0]!, 0) / firstRing.length;
    const shiftRight = avgLon < 0;

    return {
      type: "Polygon",
      coordinates: rings.map((ring) => fixRingCoordinates(ring, shiftRight)),
    };
  } else if (geometry.type === "MultiPolygon") {
    const polygons = geometry.coordinates as number[][][][];

    return {
      type: "MultiPolygon",
      coordinates: polygons.map((polygon) => {
        const needsFix = polygon.some((ring) => ringCrossesAntimeridian(ring));

        if (!needsFix) return polygon;

        const firstRing = polygon[0]!;
        const avgLon =
          firstRing.reduce((sum, coord) => sum + coord[0]!, 0) /
          firstRing.length;
        const shiftRight = avgLon < 0;

        return polygon.map((ring) => fixRingCoordinates(ring, shiftRight));
      }),
    };
  }

  return geometry;
}

/**
 * Fixes antimeridian crossing issues in a GeoJSON FeatureCollection.
 * This is needed for features like Russia, Fiji, etc. that span across ±180° longitude.
 */
export function fixAntimeridianCrossing(
  collection: GeoJSONFeatureCollection,
): GeoJSONFeatureCollection {
  return {
    type: "FeatureCollection",
    features: collection.features.map((feature) => ({
      ...feature,
      geometry: fixGeometry(feature.geometry),
    })),
  };
}

/**
 * Calculates the bounding box of a GeoJSON FeatureCollection
 * Returns [minLon, minLat, maxLon, maxLat]
 */
export function calculateBounds(
  collection: GeoJSONFeatureCollection,
): [number, number, number, number] {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;

  function processCoordinates(coords: number[]): void {
    const lon = coords[0]!;
    const lat = coords[1]!;
    minLon = Math.min(minLon, lon);
    minLat = Math.min(minLat, lat);
    maxLon = Math.max(maxLon, lon);
    maxLat = Math.max(maxLat, lat);
  }

  function processRing(ring: number[][]): void {
    ring.forEach(processCoordinates);
  }

  for (const feature of collection.features) {
    const geometry = feature.geometry;

    if (geometry.type === "Polygon") {
      (geometry.coordinates as number[][][]).forEach(processRing);
    } else if (geometry.type === "MultiPolygon") {
      (geometry.coordinates as number[][][][]).forEach((polygon) => {
        polygon.forEach(processRing);
      });
    }
  }

  return [minLon, minLat, maxLon, maxLat];
}

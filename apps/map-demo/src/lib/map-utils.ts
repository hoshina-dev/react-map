/**
 * Calculate optimal tolerance for geometry simplification based on zoom level
 * Higher zoom = more detail needed = lower tolerance
 * Lower zoom = less detail needed = higher tolerance (smaller file size)
 *
 * @param zoom - Current map zoom level (0-22)
 * @returns tolerance value for GAPI query
 */
export function getToleranceForZoom(zoom: number): number {
  // Aggressive simplification for world view
  if (zoom < 3) return 0.1;
  // Medium simplification for continental view
  if (zoom < 5) return 0.05;
  // Light simplification for country view
  if (zoom < 7) return 0.01;
  // Minimal simplification for regional view
  if (zoom < 10) return 0.005;
  // High detail for city/local view
  return 0.001;
}

/**
 * Determine admin level to load based on zoom
 * @param zoom - Current map zoom level
 * @returns admin level (0 = countries, 1 = states/provinces, etc.)
 */
export function getAdminLevelForZoom(zoom: number): number {
  if (zoom < 4) return 0; // Countries
  if (zoom < 6) return 1; // States/Provinces
  if (zoom < 9) return 2; // Districts/Counties
  return 3; // Cities/Municipalities
}

/**
 * Check if we should load more detailed boundaries based on zoom change
 * @param oldZoom - Previous zoom level
 * @param newZoom - New zoom level
 * @returns true if we should fetch more detailed data
 */
export function shouldLoadMoreDetail(
  oldZoom: number,
  newZoom: number,
): boolean {
  const oldLevel = getAdminLevelForZoom(oldZoom);
  const newLevel = getAdminLevelForZoom(newZoom);
  return newLevel > oldLevel;
}

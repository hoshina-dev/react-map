import type { GeoJSONFeatureCollection, LayerVariant } from "../core/types";

/**
 * Interface for loading geographic data from any source.
 * Implementations can fetch from GraphQL, REST APIs, static files, etc.
 */
export interface GeoDataLoader {
  /**
   * Load the world map (level 0 - all countries)
   */
  loadWorldMap(): Promise<GeoJSONFeatureCollection>;

  /**
   * Load admin boundaries for a specific parent region (level 1)
   * @param parentCode - The ISO code or identifier of the parent region (e.g., "US", "DE")
   * @returns GeoJSON data or null if not found
   */
  loadAdminBoundaries(
    parentCode: string,
  ): Promise<GeoJSONFeatureCollection | null>;

  /**
   * Load sub-admin boundaries for a specific region (level 2)
   * @param parentCode - The ISO code or identifier of the parent admin region
   * @returns GeoJSON data or null if not found
   */
  loadSubAdminBoundaries?(
    parentCode: string,
  ): Promise<GeoJSONFeatureCollection | null>;
}

/**
 * Configuration for a single map level
 */
export interface LevelConfig {
  layerId: string;
  highlightProperty: string;
  variant: LayerVariant;
  dataLoader: GeoDataLoader;
}

/**
 * Helper to create a level configuration
 */
export function createLevelConfig(
  config: Omit<LevelConfig, "highlightProperty"> & {
    highlightProperty?: string;
  },
): LevelConfig {
  return {
    highlightProperty: "name",
    ...config,
  };
}

/**
 * Helper to create standard level configurations
 */
export function createStandardLevelConfigs(
  dataLoader: GeoDataLoader,
  maxLevel: number = 1,
): Record<number, LevelConfig> {
  const configs: Record<number, LevelConfig> = {
    0: createLevelConfig({
      layerId: "world-countries",
      variant: "country",
      dataLoader,
    }),
  };

  if (maxLevel >= 1) {
    configs[1] = createLevelConfig({
      layerId: "admin-boundaries-1",
      variant: "default",
      dataLoader,
    });
  }

  if (maxLevel >= 2) {
    configs[2] = createLevelConfig({
      layerId: "admin-boundaries-2",
      variant: "default",
      dataLoader,
    });
  }

  return configs;
}

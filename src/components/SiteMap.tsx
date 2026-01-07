"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import Map, {
  type MapLayerMouseEvent,
  type MapRef,
} from "react-map-gl/maplibre";

import type { LevelConfig } from "../adapters/types";
import {
  calculateBounds,
  type FocusedEntity,
  type GeoJSONFeatureCollection,
  INITIAL_VIEW_STATE,
  type MapViewState,
  type SelectedFeature,
} from "../core";
import { GeoLayer } from "./GeoLayer";

export interface SiteMapHandle {
  goBack: () => void;
  exitFocus: () => void;
}

export interface SiteMapProps {
  /**
   * Configuration for each map level with injected data loaders
   */
  levelConfigs: Record<number, LevelConfig>;

  /**
   * Maximum drill-down level (default: 1)
   */
  maxLevel?: number;

  /**
   * Initial view state for the map
   */
  initialViewState?: MapViewState;

  /**
   * Map style URL (default: Carto Positron)
   */
  mapStyle?: string;

  /**
   * Callback when focused entity changes
   */
  onEntityChange?: (entity: FocusedEntity | null) => void;

  /**
   * Callback when hovering over features
   */
  onHover?: (featureName: string | null) => void;

  /**
   * Callback when a feature is selected
   */
  onFeatureSelect?: (feature: SelectedFeature) => void;
}

export const SiteMap = forwardRef<SiteMapHandle, SiteMapProps>(function SiteMap(
  {
    levelConfigs,
    maxLevel = 1,
    initialViewState = INITIAL_VIEW_STATE,
    mapStyle = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    onEntityChange,
    onHover,
    onFeatureSelect,
  },
  ref,
) {
  const mapRef = useRef<MapRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // View state
  const [viewState, setViewState] = useState<MapViewState>(initialViewState);

  // Layer data cache
  const [layerData, setLayerData] = useState<
    Record<number, GeoJSONFeatureCollection>
  >({});

  // Focus tracking
  const [focusLevel, setFocusLevel] = useState(0);
  const [entityStack, setEntityStack] = useState<FocusedEntity[]>([]);
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(
    null,
  );
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // Loading and transition states
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Current level config
  const currentConfig = levelConfigs[focusLevel];

  // Current data to display
  const currentData = layerData[focusLevel];

  // Load initial world map
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      const level0Config = levelConfigs[0];
      if (!level0Config) {
        console.error("Level 0 configuration is required");
        setIsLoading(false);
        return;
      }

      try {
        const worldData = await level0Config.dataLoader.loadWorldMap();
        if (worldData) {
          setLayerData({ 0: worldData });
        }
      } catch (error) {
        console.error("Failed to load world map:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, [levelConfigs]);

  // Fit map to bounds with smooth animation
  const fitToBounds = useCallback((data: GeoJSONFeatureCollection) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const bounds = calculateBounds(data);
    const [minLon, minLat, maxLon, maxLat] = bounds;

    map.fitBounds(
      [
        [minLon, minLat],
        [maxLon, maxLat],
      ],
      {
        padding: 50,
        duration: 500,
        maxZoom: 10,
      },
    );
  }, []);

  // Zoom to a specific feature with smooth animation
  const zoomToFeature = useCallback(
    (featureName: string) => {
      const map = mapRef.current?.getMap();
      if (!map || !currentData) return;

      const feature = currentData.features.find(
        (f) => f.properties.name === featureName,
      );

      if (!feature) return;

      const singleFeatureCollection: GeoJSONFeatureCollection = {
        type: "FeatureCollection",
        features: [feature],
      };

      const bounds = calculateBounds(singleFeatureCollection);
      const [minLon, minLat, maxLon, maxLat] = bounds;

      map.fitBounds(
        [
          [minLon, minLat],
          [maxLon, maxLat],
        ],
        {
          padding: 100,
          duration: 500,
          maxZoom: 10,
        },
      );
    },
    [currentData],
  );

  // Handle click on a feature
  const handleClick = useCallback(
    async (event: MapLayerMouseEvent) => {
      // Block interactions during transitions or loading
      if (isTransitioning || isLoading) return;

      const features = event.features;
      if (!features?.length) return;

      const feature = features[0]!;
      const featureProps = feature.properties as Record<string, unknown> | null;
      const name = featureProps?.["name"] as string | undefined;
      const isoCode = featureProps?.["isoCode"] as string | undefined;

      if (!name) return;

      // If at max level, just select the feature without drilling down
      if (focusLevel >= maxLevel) {
        setIsTransitioning(true);
        setSelectedFeature(name);
        zoomToFeature(name);
        onFeatureSelect?.({
          name,
          isoCode,
          level: focusLevel,
        });
        setTimeout(() => setIsTransitioning(false), 500);
        return;
      }

      const nextLevel = focusLevel + 1;
      const nextConfig = levelConfigs[nextLevel];

      if (!nextConfig) return;

      setIsTransitioning(true);
      setIsLoading(true);
      try {
        // Load data for the next level using appropriate loader method
        let data: GeoJSONFeatureCollection | null = null;

        if (nextLevel === 1) {
          data = await nextConfig.dataLoader.loadAdminBoundaries(
            isoCode ?? name,
          );
        } else if (
          nextLevel === 2 &&
          nextConfig.dataLoader.loadSubAdminBoundaries
        ) {
          data = await nextConfig.dataLoader.loadSubAdminBoundaries(
            isoCode ?? name,
          );
        } else if (nextLevel > 2) {
          // For levels beyond 2, fall back to loadAdminBoundaries if available
          data = await nextConfig.dataLoader.loadAdminBoundaries(
            isoCode ?? name,
          );
        }

        if (data && data.features.length > 0) {
          // Update layer data
          setLayerData((prev) => ({ ...prev, [nextLevel]: data }));

          // Update entity stack with new focused entity
          const newEntity: FocusedEntity = { name, level: nextLevel, isoCode };
          setEntityStack((prev) => [...prev, newEntity]);
          setFocusLevel(nextLevel);

          // Notify parent
          onEntityChange?.(newEntity);

          // Fit map to new bounds with smooth animation
          fitToBounds(data);
          setTimeout(() => setIsTransitioning(false), 300);
        } else {
          // No data available for next level, treat as selection instead
          setSelectedFeature(name);
          zoomToFeature(name);
          onFeatureSelect?.({
            name,
            isoCode,
            level: focusLevel,
          });
          setTimeout(() => setIsTransitioning(false), 500);
        }
      } catch (error) {
        console.error(`Failed to load level ${nextLevel} data:`, error);
        // On error, treat as selection
        setSelectedFeature(name);
        zoomToFeature(name);
        onFeatureSelect?.({
          name,
          isoCode,
          level: focusLevel,
        });
        setTimeout(() => setIsTransitioning(false), 500);
      } finally {
        setIsLoading(false);
      }
    },
    [
      isTransitioning,
      isLoading,
      focusLevel,
      maxLevel,
      levelConfigs,
      fitToBounds,
      onEntityChange,
      onFeatureSelect,
      zoomToFeature,
    ],
  );

  // Handle mouse move for hover highlighting
  const handleMouseMove = useCallback(
    (event: MapLayerMouseEvent) => {
      // Block hover changes during transitions
      if (isTransitioning) return;

      const features = event.features;
      const featureName = features?.[0]?.properties?.name as string | undefined;

      setHighlightedFeature(featureName ?? null);
      onHover?.(featureName ?? null);
    },
    [isTransitioning, onHover],
  );

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (isTransitioning) return;
    setHighlightedFeature(null);
    onHover?.(null);
  }, [isTransitioning, onHover]);

  // Navigate back one level
  const goBack = useCallback(() => {
    if (focusLevel === 0 || isTransitioning) return;

    setIsTransitioning(true);

    const newStack = entityStack.slice(0, -1);
    const newLevel = focusLevel - 1;

    setEntityStack(newStack);
    setFocusLevel(newLevel);
    setSelectedFeature(null);
    setHighlightedFeature(null);

    // Clear the data for the level we're leaving
    setLayerData((prev) => {
      const updated = { ...prev };
      delete updated[focusLevel];
      return updated;
    });

    // Notify parent
    const newEntity = newStack[newStack.length - 1] ?? null;
    onEntityChange?.(newEntity);

    // Animate to new view
    const map = mapRef.current?.getMap();
    if (newLevel === 0) {
      // Fly back to world view
      map?.flyTo({
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        duration: 500,
      });
    } else if (newLevel > 0 && layerData[newLevel]) {
      // Fit to parent level bounds
      fitToBounds(layerData[newLevel]!);
    }

    setTimeout(() => setIsTransitioning(false), 500);
  }, [
    focusLevel,
    isTransitioning,
    entityStack,
    layerData,
    initialViewState,
    fitToBounds,
    onEntityChange,
  ]);

  // Exit all focus (return to world view)
  const exitFocus = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setEntityStack([]);
    setFocusLevel(0);
    setSelectedFeature(null);
    setHighlightedFeature(null);
    setLayerData((prev) => ({ 0: prev[0]! }));

    // Fly back to default world view
    const map = mapRef.current?.getMap();
    map?.flyTo({
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      duration: 500,
    });

    onEntityChange?.(null);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, initialViewState, onEntityChange]);

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      goBack,
      exitFocus,
    }),
    [goBack, exitFocus],
  );

  // Get interactive layer IDs for hover/click detection
  const interactiveLayerIds = useMemo(() => {
    const ids: string[] = [];
    if (currentConfig) {
      ids.push(`${currentConfig.layerId}-fill`);
    }
    return ids;
  }, [currentConfig]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        interactiveLayerIds={interactiveLayerIds}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        cursor={
          isTransitioning ? "default" : highlightedFeature ? "pointer" : "grab"
        }
      >
        {currentConfig && currentData && (
          <GeoLayer
            key={currentConfig.layerId}
            id={currentConfig.layerId}
            data={currentData}
            variant={currentConfig.variant}
            highlightedFeature={highlightedFeature}
            selectedFeature={selectedFeature}
          />
        )}
      </Map>

      {/* Loading overlay */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.7)",
            zIndex: 10,
          }}
        >
          <div>Loading...</div>
        </div>
      )}
    </div>
  );
});

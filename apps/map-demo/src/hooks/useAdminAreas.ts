import { useCallback, useEffect, useRef, useState } from "react";

interface GeoJSONFeature {
  type: "Feature";
  id: string;
  properties: {
    id: string;
    name: string;
    isoCode: string;
    adminLevel: number;
    parentCode?: string | null;
  };
  geometry: any;
}

interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// In-memory cache to avoid re-fetching
const cache = new Map<string, GeoJSONFeatureCollection>();

interface UseAdminAreasOptions {
  adminLevel: number;
  tolerance?: number;
  enabled?: boolean;
}

export function useAdminAreas({
  adminLevel,
  tolerance = 0.01,
  enabled = true,
}: UseAdminAreasOptions) {
  const [data, setData] = useState<GeoJSONFeatureCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    const cacheKey = `adminAreas-${adminLevel}-${tolerance}`;

    // Check cache first
    if (cache.has(cacheKey)) {
      setData(cache.get(cacheKey)!);
      return;
    }

    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin-areas?adminLevel=${adminLevel}&tolerance=${tolerance}`,
        {
          signal: abortControllerRef.current.signal,
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const geojson = await response.json();

      // Cache the result
      cache.set(cacheKey, geojson);
      setData(geojson);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [adminLevel, tolerance, enabled]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

interface UseChildrenByCodeOptions {
  parentCode: string | null;
  childLevel: number;
  tolerance?: number;
  enabled?: boolean;
}

export function useChildrenByCode({
  parentCode,
  childLevel,
  tolerance = 0.01,
  enabled = true,
}: UseChildrenByCodeOptions) {
  const [data, setData] = useState<GeoJSONFeatureCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || !parentCode || parentCode.trim() === "") {
      return;
    }

    const cacheKey = `children-${parentCode}-${childLevel}-${tolerance}`;
    const url = `/api/admin-areas/children/${encodeURIComponent(parentCode)}?childLevel=${childLevel}&tolerance=${tolerance}`;

    // Check cache first
    if (cache.has(cacheKey)) {
      setData(cache.get(cacheKey)!);
      return;
    }

    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const geojson = await response.json();

      // Cache the result
      cache.set(cacheKey, geojson);
      setData(geojson);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [parentCode, childLevel, tolerance, enabled]);

  useEffect(() => {
    if (enabled && parentCode && parentCode.trim() !== "") {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, enabled, parentCode]);

  return { data, loading, error, refetch: fetchData };
}

// Clear cache function (useful for memory management)
export function clearAdminAreasCache() {
  cache.clear();
}

// Get cache size (for debugging)
export function getAdminAreasCacheSize() {
  return cache.size;
}

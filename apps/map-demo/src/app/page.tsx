"use client";

import { Map } from "@hoshina/react-map";
import { Flex } from "@mantine/core";
import { useCallback, useState } from "react";

import { BoundaryLayer } from "@/components/BoundaryLayer";
import { ClickHandler } from "@/components/ClickHandler";
import { Marker } from "@/components/Marker";
import { SettingsPanel } from "@/components/SettingsPanel";
import {
  clearAdminAreasCache,
  useAdminAreas,
  useChildrenByCode,
} from "@/hooks/useAdminAreas";
import { LEVEL_STYLES, ToleranceSettings } from "@/types/admin-areas";

export default function Home() {
  const [tolerance, setTolerance] = useState<ToleranceSettings>({
    level0: 0.01,
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
  });

  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null);
  const [parentHierarchy, setParentHierarchy] = useState<string[]>([]); // Stack of parent area codes
  const [_, setForceRefresh] = useState(0);
  const [maxLevel, setMaxLevel] = useState(4);
  const [selectedForFinal, setSelectedForFinal] = useState(false);

  // Get the current parent area from the hierarchy
  const parentArea = parentHierarchy[currentLevel - 1] || null;

  // Fetch countries (level 0) initially
  const {
    data: countriesData,
    loading: countriesLoading,
    refetch: refetchCountries,
  } = useAdminAreas({
    adminLevel: 0,
    tolerance: tolerance.level0,
    enabled: currentLevel === 0,
  });

  // Fetch children when drilling down
  const {
    data: childrenData,
    loading: childrenLoading,
    refetch: refetchChildren,
  } = useChildrenByCode({
    parentCode: parentArea,
    childLevel: currentLevel,
    tolerance: tolerance[`level${currentLevel}` as keyof ToleranceSettings],
    enabled: currentLevel > 0 && !!parentArea,
  });

  const handleCountryClick = useCallback(
    async (areaCode: string, areaName: string, _geometry: unknown) => {
      // Check if we've reached max level
      if (currentLevel >= maxLevel) {
        setSelectedForFinal(true);
        setSelectedArea(areaCode);
        setSelectedAreaName(areaName);
        // Don't change parentArea - keep showing current level
        return;
      }

      // Check if next level has sufficient data
      const nextLevel = currentLevel + 1;
      const nextTolerance =
        tolerance[`level${nextLevel}` as keyof ToleranceSettings];

      try {
        const response = await fetch(
          `/api/admin-areas/children/${encodeURIComponent(areaCode)}?childLevel=${nextLevel}&tolerance=${nextTolerance}`,
        );

        if (response.ok) {
          const data = await response.json();
          const featureCount = data?.features?.length || 0;

          // If next level has 0 or 1 features, treat this as a final selection
          if (featureCount <= 1) {
            setSelectedForFinal(true);
            setSelectedArea(areaCode);
            setSelectedAreaName(areaName);
            // Don't change parentArea - keep showing current level
            return;
          }
        }
      } catch (error) {
        console.error("Error checking children:", error);
        // On error, treat as final selection to be safe
        setSelectedForFinal(true);
        setSelectedArea(areaCode);
        setSelectedAreaName(areaName);
        // Don't change parentArea - keep showing current level
        return;
      }

      // Normal drill down
      setSelectedForFinal(false);
      setSelectedArea(areaCode);
      setSelectedAreaName(areaName);
      setParentHierarchy((prev) => [...prev, areaCode]); // Add to hierarchy stack
      setCurrentLevel((prev) => prev + 1);
    },
    [currentLevel, maxLevel, tolerance],
  );

  const handleZoomOut = useCallback(() => {
    setCurrentLevel((prev) => {
      const newLevel = prev - 1;
      // Remove the last parent from hierarchy when zooming out
      setParentHierarchy((hierarchy) => hierarchy.slice(0, newLevel));
      return newLevel;
    });
    setSelectedArea(null);
    setSelectedAreaName(null);
    setSelectedForFinal(false);
  }, []);

  const handleRerender = () => {
    setForceRefresh((prev) => prev + 1);
  };

  const handleRefetch = () => {
    clearAdminAreasCache();
    if (currentLevel === 0) {
      refetchCountries();
    } else {
      refetchChildren();
    }
  };

  const featuresLoaded =
    currentLevel === 0
      ? countriesData?.features?.length || 0
      : childrenData?.features?.length || 0;

  const currentData = currentLevel === 0 ? countriesData : childrenData;
  const levelStyle = LEVEL_STYLES[currentLevel] || LEVEL_STYLES[0];

  return (
    <Flex style={{ width: "100vw", height: "100vh" }}>
      <Map>
        <Marker />
        <BoundaryLayer
          data={currentData}
          style={levelStyle}
          selectedAreaCode={selectedArea}
          isSelectedForFinal={selectedForFinal}
        />
        <ClickHandler
          currentLevel={currentLevel}
          onGeometryClick={handleCountryClick}
          onZoomOut={handleZoomOut}
        />
      </Map>

      <SettingsPanel
        tolerance={tolerance}
        onToleranceChange={setTolerance}
        onRerender={handleRerender}
        onRefetch={handleRefetch}
        currentLevel={currentLevel}
        selectedArea={selectedArea}
        selectedAreaName={selectedAreaName}
        loading={countriesLoading || childrenLoading}
        featuresLoaded={featuresLoaded}
        maxLevel={maxLevel}
        onMaxLevelChange={setMaxLevel}
        selectedForFinal={selectedForFinal}
      />
    </Flex>
  );
}

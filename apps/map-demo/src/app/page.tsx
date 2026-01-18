"use client";

import { Flex } from "@mantine/core";
import { useState } from "react";

import { Map } from "@/components/Map";
import { SettingsPanel } from "@/components/SettingsPanel";
import {
  clearAdminAreasCache,
  useAdminAreas,
  useChildrenByCode,
} from "@/hooks/useAdminAreas";
import { ToleranceSettings } from "@/types/admin-areas";

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
  const [forceRefresh, setForceRefresh] = useState(0);

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
    parentCode: selectedArea,
    childLevel: currentLevel,
    tolerance: tolerance[`level${currentLevel}` as keyof ToleranceSettings],
    enabled: currentLevel > 0 && !!selectedArea,
  });

  const handleCountryClick = (
    areaCode: string,
    areaName: string,
    _geometry: any,
  ) => {
    setSelectedArea(areaCode);
    setSelectedAreaName(areaName);
    setCurrentLevel(currentLevel + 1);
  };

  const handleZoomOut = () => {
    setCurrentLevel((prev) => prev - 1);
    setSelectedArea(null);
    setSelectedAreaName(null);
  };

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

  return (
    <Flex style={{ width: "100vw", height: "100vh" }}>
      <Map
        countriesData={countriesData}
        childrenData={childrenData}
        currentLevel={currentLevel}
        onCountryClick={handleCountryClick}
        onZoomOut={handleZoomOut}
      />

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
      />
    </Flex>
  );
}

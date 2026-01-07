# @hoshina/react-map

[![](https://img.shields.io/npm/v/@hoshina/react-map.svg?maxAge=3600)](https://www.npmjs.com/package/@hoshina/react-map)
[![](https://img.shields.io/npm/dt/@hoshina/react-map.svg?maxAge=3600)](https://www.npmjs.com/package/@hoshina/react-map)

Reusable map components within Hoshina Dev's applications.

## Features

- **Technology Neutral**: Components are decoupled from data sources
- **Dependency Injection**: Data fetching logic is injected via adapters
- **TypeScript First**: Fully typed with comprehensive interfaces
- **Testable**: Easy to test with mock data loaders

## Architecture

```
src/
├── core/          # Pure types and utilities (no external dependencies)
├── adapters/      # Data fetching interfaces
└── components/    # React UI components
```

## Usage

### 1. Implement a Data Adapter

```ts
import type { GeoDataLoader } from "@hoshina/react-map";

class MyDataLoader implements GeoDataLoader {
  async loadWorldMap() {
    // Fetch from your API (Level 0 - countries)
    return geoJSONData;
  }

  async loadAdminBoundaries(parentCode: string) {
    // Fetch child regions (Level 1 - states/provinces)
    return childGeoJSON;
  }

  async loadSubAdminBoundaries(parentCode: string) {
    // Fetch sub-regions (Level 2 - counties/districts) - Optional
    return subRegionGeoJSON;
  }
}
```

### 2. Use the Components

```tsx
import { SiteMap, createStandardLevelConfigs } from "@hoshina/react-map";

const dataLoader = new MyDataLoader();

// Standard config for 2-level drill-down (World → Country → Region)
const levelConfigs = createStandardLevelConfigs(dataLoader, 2);

<SiteMap levelConfigs={levelConfigs} maxLevel={2} />;
```

Or create custom level configurations:

```tsx
import { SiteMap, createLevelConfig } from "@hoshina/react-map";

const levelConfigs = {
  0: createLevelConfig({
    layerId: "world-countries",
    variant: "country",
    dataLoader,
  }),
  1: createLevelConfig({
    layerId: "admin-boundaries-1",
    variant: "default",
    dataLoader,
  }),
  2: createLevelConfig({
    layerId: "admin-boundaries-2",
    variant: "default",
    dataLoader,
  }),
};

<SiteMap levelConfigs={levelConfigs} maxLevel={2} />;
```

## Map Levels

The library supports multiple drill-down levels:

- **Level 0**: World map (countries)
- **Level 1**: Admin boundaries (states/provinces)
- **Level 2**: Sub-admin boundaries (counties/districts)

Set `maxLevel` to control the maximum drill-down depth. The `GeoDataLoader` interface supports:

- `loadWorldMap()` - Required for level 0
- `loadAdminBoundaries()` - Required for level 1
- `loadSubAdminBoundaries()` - Optional for level 2

## Components

- **SiteMap**: Main interactive map component
- **GeoLayer**: Renders GeoJSON features with styling
- **MapInfoBar**: Displays current focus and hover information

## Core Utilities

- **geoUtils**: Geographic calculations (bounds, antimeridian fixes)
- **types**: Pure GeoJSON and map-related type definitions

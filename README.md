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
    // Fetch from your API
    return geoJSONData;
  }

  async loadAdminBoundaries(parentCode: string) {
    // Fetch child regions
    return childGeoJSON;
  }
}
```

### 2. Use the Components

```tsx
import { SiteMap, createLevelConfig } from "@hoshina/react-map";

const dataLoader = new MyDataLoader();

const levelConfigs = {
  0: createLevelConfig({
    layerId: "world-countries",
    variant: "country",
    dataLoader,
  }),
};

<SiteMap levelConfigs={levelConfigs} maxLevel={1} />;
```

## Components

- **SiteMap**: Main interactive map component
- **GeoLayer**: Renders GeoJSON features with styling
- **MapInfoBar**: Displays current focus and hover information

## Core Utilities

- **geoUtils**: Geographic calculations (bounds, antimeridian fixes)
- **types**: Pure GeoJSON and map-related type definitions

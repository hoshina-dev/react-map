# @repo/map

Reusable map components for MapFox applications.

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

```typescript
import type { GeoDataLoader } from "@repo/map";

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

```typescript
import { SiteMap, createLevelConfig } from '@repo/map';

const dataLoader = new MyDataLoader();

const levelConfigs = {
  0: createLevelConfig({
    layerId: 'world-countries',
    variant: 'country',
    dataLoader,
  }),
};

<SiteMap levelConfigs={levelConfigs} maxLevel={1} />
```

## Components

- **SiteMap**: Main interactive map component
- **GeoLayer**: Renders GeoJSON features with styling
- **MapInfoBar**: Displays current focus and hover information

## Core Utilities

- **geoUtils**: Geographic calculations (bounds, antimeridian fixes)
- **types**: Pure GeoJSON and map-related type definitions

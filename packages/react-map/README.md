# @hoshina/react-map

[![](https://img.shields.io/npm/v/@hoshina/react-map.svg?maxAge=3600)](https://www.npmjs.com/package/@hoshina/react-map)
[![](https://img.shields.io/npm/dt/@hoshina/react-map.svg?maxAge=3600)](https://www.npmjs.com/package/@hoshina/react-map)

High abstraction React map library built on MapLibre GL.

## Features

- **High Abstraction**: Minimal, unopinionated wrapper around MapLibre GL
- **Bring Your Own Data**: Complete control over data fetching and management
- **Context-based API**: Access map instance anywhere in component tree
- **TypeScript First**: Fully typed with comprehensive interfaces
- **React Server Components Compatible**: Works seamlessly with Next.js App Router

## Architecture

The library provides a thin abstraction layer that handles:

- Map initialization and lifecycle management
- Context provider for accessing map instance
- Type definitions for MapLibre GL integration

Everything else (data fetching, layer management, user interactions) is implemented by you using the map context.

## Installation

```bash
npm install @hoshina/react-map maplibre-gl
# or
pnpm add @hoshina/react-map maplibre-gl
```

## Usage

### Basic Setup

```tsx
import { Map, useMap } from "@hoshina/react-map";

function MyMapComponent() {
  return (
    <Map>
      <YourCustomLayers />
      <YourClickHandlers />
    </Map>
  );
}
```

### Accessing the Map Instance

Use the `useMap` hook to access the MapLibre GL map instance:

```tsx
import { useMap } from "@hoshina/react-map";

function CustomLayer() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Add your custom source and layer
    map.addSource("my-data", {
      type: "geojson",
      data: myGeoJSON,
    });

    map.addLayer({
      id: "my-layer",
      type: "fill",
      source: "my-data",
      paint: {
        "fill-color": "#088",
        "fill-opacity": 0.5,
      },
    });

    return () => {
      // Cleanup
      if (map.getLayer("my-layer")) map.removeLayer("my-layer");
      if (map.getSource("my-data")) map.removeSource("my-data");
    };
  }, [map]);

  return null;
}
```

### Handling User Interactions

```tsx
function ClickHandler() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: maplibregl.MapLayerMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point);
      console.log("Clicked features:", features);
    };

    map.on("click", "my-layer", handleClick);
    return () => {
      map.off("click", "my-layer", handleClick);
    };
  }, [map]);

  return null;
}
```

## API Reference

### Components

#### `<Map>`

The main map container component. Initializes MapLibre GL and provides context to children.

```tsx
<Map>{children}</Map>
```

### Hooks

#### `useMap()`

Returns the MapLibre GL map instance or `null` if not yet initialized.

```tsx
const map = useMap();
```

### Types

#### `MapLevelStyle`

Style configuration for map layers:

```ts
interface MapLevelStyle {
  fillColor: string;
  lineColor: string;
  lineWidth: number;
}
```

## Example: Building a Multi-Level Drill-Down Map

See the [demo app](../../apps/map-demo) for a complete example implementing:

- Configurable max drill-down level
- Smart selection for areas without sub-divisions
- Hierarchical navigation with proper data display
- Visual feedback for selected areas
- Boundary layers with hover effects

## License

MIT

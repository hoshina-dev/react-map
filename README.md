# React Map Monorepo

A monorepo containing a high abstraction React map library built on MapLibre GL and a demo application.

## 📦 Packages

### [@hoshina/react-map](./packages/react-map)

[![npm version](https://img.shields.io/npm/v/@hoshina/react-map.svg)](https://www.npmjs.com/package/@hoshina/react-map)
[![npm downloads](https://img.shields.io/npm/dt/@hoshina/react-map.svg)](https://www.npmjs.com/package/@hoshina/react-map)

Minimal, unopinionated React wrapper around MapLibre GL. Provides context-based API for accessing map instances with full TypeScript support and React Server Components compatibility.

**[View Package Documentation →](./packages/react-map/README.md)**

### [map-demo](./apps/map-demo)

Demo application showcasing `@hoshina/react-map` with real-world examples including:

- Administrative boundary visualization
- Interactive click handlers
- Custom markers and layers
- GraphQL data integration

## 🚀 Getting Started

### Prerequisites

- Node.js 24 LTS (^24.11)
- pnpm via corepack: `corepack enable`

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Run web demo + watch build packages
pnpm dev
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @hoshina/react-map build
```

## 🛠️ Development Commands

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Start development servers for all packages |
| `pnpm build`       | Build all packages                         |
| `pnpm lint`        | Run linting across all packages            |
| `pnpm lint-strict` | Run strict linting with all rules enabled  |
| `pnpm format`      | Format code with Prettier                  |
| `pnpm check-types` | Run TypeScript type checking               |

## 📁 Project Structure

```
react-map/
├── apps/
│   └── map-demo/          # Demo Next.js application
├── packages/
│   ├── config/            # Shared ESLint and TypeScript configs
│   └── react-map/         # Core map library (published to npm)
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 🤝 Contributing

This monorepo uses:

- **pnpm** for package management
- **Turbo** for build orchestration
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality

## 📄 License

MIT

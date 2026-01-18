export interface ToleranceSettings {
  level0: number;
  level1: number;
  level2: number;
  level3: number;
  level4: number;
}

export interface AdminLevel {
  level: number;
  label: string;
  description: string;
  color: string;
}

export const ADMIN_LEVELS: AdminLevel[] = [
  {
    level: 0,
    label: "Countries",
    description: "National boundaries",
    color: "#3498db",
  },
  {
    level: 1,
    label: "States/Provinces",
    description: "First-level divisions",
    color: "#2ecc71",
  },
  {
    level: 2,
    label: "Districts/Counties",
    description: "Second-level divisions",
    color: "#f39c12",
  },
  {
    level: 3,
    label: "Cities/Municipalities",
    description: "Third-level divisions",
    color: "#e74c3c",
  },
  {
    level: 4,
    label: "Neighborhoods",
    description: "Fourth-level divisions",
    color: "#9b59b6",
  },
];

export const LEVEL_STYLES = [
  { fillColor: "#3498db", lineColor: "#2c3e50", lineWidth: 2 },
  { fillColor: "#2ecc71", lineColor: "#27ae60", lineWidth: 1.5 },
  { fillColor: "#f39c12", lineColor: "#e67e22", lineWidth: 1.5 },
  { fillColor: "#e74c3c", lineColor: "#c0392b", lineWidth: 1 },
  { fillColor: "#9b59b6", lineColor: "#8e44ad", lineWidth: 1 },
];

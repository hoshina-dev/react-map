"use client";

import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";

import { ADMIN_LEVELS, ToleranceSettings } from "@/types/admin-areas";

interface SettingsPanelProps {
  tolerance: ToleranceSettings;
  onToleranceChange: (tolerance: ToleranceSettings) => void;
  onRerender: () => void;
  onRefetch: () => void;
  currentLevel: number;
  selectedArea: string | null;
  selectedAreaName: string | null;
  loading: boolean;
  featuresLoaded: number;
  maxLevel: number;
  onMaxLevelChange: (maxLevel: number) => void;
  selectedForFinal: boolean;
  markerLat: number;
  markerLng: number;
  onMarkerLatChange: (lat: number) => void;
  onMarkerLngChange: (lng: number) => void;
}

export function SettingsPanel({
  tolerance,
  onToleranceChange,
  onRerender,
  onRefetch,
  currentLevel,
  selectedArea,
  selectedAreaName,
  loading,
  featuresLoaded,
  maxLevel,
  onMaxLevelChange,
  selectedForFinal,
  markerLat,
  markerLng,
  onMarkerLatChange,
  onMarkerLngChange,
}: SettingsPanelProps) {
  return (
    <Paper
      shadow="md"
      style={{
        width: "400px",
        height: "100vh",
        overflowY: "auto",
        borderLeft: "1px solid #e0e0e0",
      }}
      p="md"
    >
      <Stack gap="md">
        {/* Header with action buttons */}
        <Flex justify="space-between" align="center">
          <Title order={3}>Settings</Title>
          <Group gap="xs">
            <Tooltip label="Rerender using cached data if available">
              <Button variant="light" size="compact-sm" onClick={onRerender}>
                Rerender
              </Button>
            </Tooltip>
            <Tooltip label="Refetch data, ignoring cache">
              <Button
                variant="filled"
                size="compact-sm"
                onClick={onRefetch}
                loading={loading}
              >
                Refetch
              </Button>
            </Tooltip>
          </Group>
        </Flex>

        <Text size="sm" c="dimmed">
          Configure tolerance values for geometry simplification at different
          admin levels.
        </Text>

        <Divider />

        {/* Current State */}
        <Paper p="md" withBorder bg="blue.0">
          <Stack gap="xs">
            <Title order={5}>Current State</Title>
            <Flex justify="space-between" align="center">
              <Text size="sm">Admin Level:</Text>
              <Flex align="center" gap="xs">
                <Box
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor:
                      ADMIN_LEVELS[currentLevel]?.color || "#000",
                    border: "1px solid #ddd",
                    borderRadius: 3,
                  }}
                />
                <Badge variant="filled" color="blue">
                  Level {currentLevel}
                </Badge>
              </Flex>
            </Flex>
            {selectedAreaName && (
              <Flex justify="space-between">
                <Text size="sm">Selected Area:</Text>
                <Text size="sm" fw={500}>
                  {selectedAreaName}
                </Text>
              </Flex>
            )}
            {selectedArea && (
              <Flex justify="space-between">
                <Text size="sm">Area Code:</Text>
                <Text size="sm" fw={500} ff="monospace">
                  {selectedArea}
                </Text>
              </Flex>
            )}
            <Flex justify="space-between">
              <Text size="sm">Status:</Text>
              <Badge variant="light" color={loading ? "yellow" : "green"}>
                {loading ? "Loading..." : "Ready"}
              </Badge>
            </Flex>
            <Flex justify="space-between">
              <Text size="sm">Features Loaded:</Text>
              <Text size="sm" fw={500}>
                {featuresLoaded}
              </Text>
            </Flex>
            {selectedForFinal && (
              <Flex justify="space-between">
                <Text size="sm">Selection Status:</Text>
                <Badge variant="filled" color="green">
                  Area Selected
                </Badge>
              </Flex>
            )}
          </Stack>
        </Paper>

        {/* Instructions */}
        <Paper p="md" withBorder>
          <Stack gap="xs">
            <Title order={5}>Instructions</Title>
            <Text size="xs" c="dimmed">
              • <strong>Left-click</strong> on an area to drill down to the next
              level
            </Text>
            <Text size="xs" c="dimmed">
              • <strong>Right-click</strong> anywhere to zoom out to the
              previous level
            </Text>
            <Text size="xs" c="dimmed">
              • Adjust tolerance values below to control geometry detail
            </Text>
            <Text size="xs" c="dimmed">
              • When reaching max level or areas with no sub-divisions, clicking
              will select the area (shown in green)
            </Text>
          </Stack>
        </Paper>

        {/* Color Legend */}
        <Paper p="md" withBorder>
          <Stack gap="xs">
            <Title order={5}>Admin Level Colors</Title>
            {ADMIN_LEVELS.map(({ level, label, color }) => (
              <Flex key={level} align="center" gap="sm">
                <Box
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: color,
                    border: "1px solid #ddd",
                    borderRadius: 4,
                    flexShrink: 0,
                  }}
                />
                <Text size="sm">
                  <strong>Level {level}:</strong> {label}
                </Text>
              </Flex>
            ))}
          </Stack>
        </Paper>

        <Divider />

        {/* Marker Configuration */}
        <Paper p="md" withBorder bg="grape.0">
          <Stack gap="xs">
            <Title order={5}>Demo Marker Position</Title>
            <Text size="sm" c="dimmed">
              Configure the marker coordinates to demonstrate that the Marker
              component can be controlled as an individual React component.
            </Text>
            <NumberInput
              label="Latitude"
              description="Range: -90 (South) to 90 (North)"
              value={markerLat}
              onChange={(value) =>
                onMarkerLatChange(typeof value === "number" ? value : 0)
              }
              min={-90}
              max={90}
              step={0.1}
              decimalScale={4}
              allowNegative
              clampBehavior="strict"
            />
            <NumberInput
              label="Longitude"
              description="Range: -180 (West) to 180 (East)"
              value={markerLng}
              onChange={(value) =>
                onMarkerLngChange(typeof value === "number" ? value : 0)
              }
              min={-180}
              max={180}
              step={0.1}
              decimalScale={4}
              allowNegative
              clampBehavior="strict"
            />
          </Stack>
        </Paper>

        <Divider />

        {/* Max Level Configuration */}
        <Paper p="md" withBorder bg="orange.0">
          <Stack gap="xs">
            <Title order={5}>Max Drill-Down Level</Title>
            <Text size="sm" c="dimmed">
              Configure the maximum admin level you want to drill down to.
              Clicking on areas at this level will select them instead of
              drilling further.
            </Text>
            <NumberInput
              label="Maximum Level"
              description="Range: 0 (Countries) to 4 (Neighborhoods)"
              value={maxLevel}
              onChange={(value) =>
                onMaxLevelChange(typeof value === "number" ? value : 4)
              }
              min={0}
              max={4}
              step={1}
              allowDecimal={false}
              allowNegative={false}
              clampBehavior="strict"
            />
          </Stack>
        </Paper>

        <Divider />

        {/* Tolerance Settings */}
        <Title order={4}>Tolerance Settings</Title>

        {ADMIN_LEVELS.map(({ level, label, description, color }) => (
          <Paper key={level} p="md" withBorder>
            <Stack gap="xs">
              <Flex justify="space-between" align="center">
                <Flex align="center" gap="xs">
                  <Box
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: color,
                      border: "1px solid #ddd",
                      borderRadius: 3,
                      flexShrink: 0,
                    }}
                  />
                  <Text fw={500}>{label}</Text>
                </Flex>
                <Badge variant="light">Level {level}</Badge>
              </Flex>
              <Text size="xs" c="dimmed">
                {description}
              </Text>
              <NumberInput
                label="Tolerance"
                description="Higher = simpler geometry, smaller file size"
                value={tolerance[`level${level}` as keyof ToleranceSettings]}
                onChange={(value) =>
                  onToleranceChange({
                    ...tolerance,
                    [`level${level}`]: typeof value === "number" ? value : 0,
                  })
                }
                min={0}
                max={1}
                step={0.001}
                decimalScale={3}
                fixedDecimalScale
                allowNegative={false}
                clampBehavior="strict"
              />
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}

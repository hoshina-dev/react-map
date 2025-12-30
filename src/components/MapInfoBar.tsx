"use client";

import { ActionIcon, Badge, Group, Paper, Text, Tooltip } from "@mantine/core";
import { IconArrowLeft, IconX } from "@tabler/icons-react";

import type { FocusedEntity } from "../core/types";

interface MapInfoBarProps {
  focusedEntity: FocusedEntity | null;
  hoveredFeature: string | null;
  onBack?: () => void;
  onExit?: () => void;
  levelNames?: Record<number, string>;
}

const DEFAULT_LEVEL_NAMES: Record<number, string> = {
  0: "World",
  1: "Country",
};

export function MapInfoBar({
  focusedEntity,
  hoveredFeature,
  onBack,
  onExit,
  levelNames = DEFAULT_LEVEL_NAMES,
}: MapInfoBarProps) {
  return (
    <Paper
      p="sm"
      shadow="sm"
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 10,
        minWidth: 200,
      }}
    >
      <Group justify="space-between" mb={focusedEntity ? "xs" : 0}>
        <Group gap="xs">
          {focusedEntity && (
            <>
              <Tooltip label="Go back">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={onBack}
                  aria-label="Go back"
                >
                  <IconArrowLeft size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Exit focus">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  color="red"
                  onClick={onExit}
                  aria-label="Exit focus"
                >
                  <IconX size={16} />
                </ActionIcon>
              </Tooltip>
            </>
          )}
        </Group>
        <Badge size="sm" variant="light">
          {levelNames[focusedEntity?.level ?? 0] ??
            `Level ${focusedEntity?.level ?? 0}`}
        </Badge>
      </Group>

      {focusedEntity && (
        <Text size="sm" fw={500} mb="xs">
          {focusedEntity.name}
          {focusedEntity.isoCode && (
            <Text span c="dimmed" size="xs" ml="xs">
              ({focusedEntity.isoCode})
            </Text>
          )}
        </Text>
      )}

      <Text size="xs" c="dimmed">
        {hoveredFeature ? (
          <>
            Hover: <strong>{hoveredFeature}</strong>
          </>
        ) : (
          "Hover over a region"
        )}
      </Text>
    </Paper>
  );
}

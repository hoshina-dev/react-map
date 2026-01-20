"use client";

import { useMap } from "@hoshina/react-map";
import {
  Badge,
  Button,
  MantineProvider,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";

export function Marker() {
  const map = useMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const rootRef = useRef<Root | null>(null);

  useEffect(() => {
    if (!map) return;

    // Add a marker at coordinates (0, 0) with a popup
    const popupNode = document.createElement("div");

    // Create a React component for the popup content
    const PopupContent = () => (
      <MantineProvider>
        <Stack gap="xs" p="sm">
          <Title order={4}>Special Location</Title>
          <Text size="sm">Coordinates: (0, 0)</Text>
          <Badge color="blue" variant="filled">
            Null Island
          </Badge>
          <Text size="xs" c="dimmed">
            This is the intersection of the Prime Meridian and the Equator
          </Text>
          <Button size="xs" variant="light" fullWidth>
            Learn More
          </Button>
        </Stack>
      </MantineProvider>
    );

    rootRef.current = createRoot(popupNode);
    rootRef.current.render(<PopupContent />);

    const popup = new maplibregl.Popup({ offset: 25 }).setDOMContent(popupNode);

    markerRef.current = new maplibregl.Marker({ color: "#FF0000" })
      .setLngLat([0, 0])
      .setPopup(popup)
      .addTo(map);

    const rootToCleanup = rootRef.current;

    return () => {
      markerRef.current?.remove();

      setTimeout(() => {
        rootToCleanup.unmount();
      }, 0);
    };
  }, [map]);

  return null;
}

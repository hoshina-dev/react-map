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

interface MarkerProps {
  lat: number;
  lng: number;
}

export function Marker({ lat, lng }: MarkerProps) {
  const map = useMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const rootRef = useRef<Root | null>(null);

  useEffect(() => {
    if (!map) return;

    // Add a marker at the specified coordinates with a popup
    const popupNode = document.createElement("div");

    // Create a React component for the popup content
    const PopupContent = () => (
      <MantineProvider>
        <Stack gap="xs" p="sm">
          <Title order={4}>Custom Marker</Title>
          <Text size="sm">
            Coordinates: ({lat.toFixed(4)}, {lng.toFixed(4)})
          </Text>
          <Badge color="red" variant="filled">
            Demo Marker
          </Badge>
          <Text size="xs" c="dimmed">
            This marker position can be controlled via the Settings Panel
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
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    // Mark the marker element so ClickHandler can ignore it and set cursor style
    const markerElement = markerRef.current.getElement();
    markerElement.setAttribute("data-marker", "true");
    markerElement.style.cursor = "pointer";

    const rootToCleanup = rootRef.current;

    return () => {
      markerRef.current?.remove();

      setTimeout(() => {
        rootToCleanup.unmount();
      }, 0);
    };
  }, [map, lat, lng]);

  return null;
}

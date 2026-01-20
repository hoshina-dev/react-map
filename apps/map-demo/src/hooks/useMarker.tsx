import {
  Badge,
  Button,
  MantineProvider,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import maplibregl from "maplibre-gl";
import { RefObject, useEffect } from "react";
import { createRoot } from "react-dom/client";

export function useMarker(ref: RefObject<maplibregl.Map | null>) {
  useEffect(() => {
    if (!ref.current) return;

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

    const root = createRoot(popupNode);
    root.render(<PopupContent />);

    const popup = new maplibregl.Popup({ offset: 25 }).setDOMContent(popupNode);

    const marker = new maplibregl.Marker({ color: "#FF0000" })
      .setLngLat([0, 0])
      .setPopup(popup)
      .addTo(ref.current);

    return () => {
      marker.remove();
      root.unmount();
    };
  }, [ref]);
}

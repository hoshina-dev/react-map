import { MapPlugin } from "@hoshina/react-map";
import {
  Badge,
  Button,
  MantineProvider,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import maplibregl from "maplibre-gl";
import { createRoot, Root } from "react-dom/client";

export class MarkerPlugin implements MapPlugin {
  private marker: maplibregl.Marker | null = null;
  private root: Root | null = null;

  initialize(map: maplibregl.Map): void {
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

    this.root = createRoot(popupNode);
    this.root.render(<PopupContent />);

    const popup = new maplibregl.Popup({ offset: 25 }).setDOMContent(popupNode);

    this.marker = new maplibregl.Marker({ color: "#FF0000" })
      .setLngLat([0, 0])
      .setPopup(popup)
      .addTo(map);
  }

  cleanup(): void {
    this.marker?.remove();
    // this.root?.unmount();
    this.marker = null;
    this.root = null;
  }
}

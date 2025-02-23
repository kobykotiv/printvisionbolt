import { useCallback, useState } from 'react';
import { Card, Image, Group, Button, Text } from '@mantine/core';
import { IconPalette } from '@tabler/icons-react';
import { DesignsAPI } from '@/lib/api/designs';
import type { Design } from '@/types/models';

interface DesignPreviewProps {
  design: Design;
  onUpdate: (data: Partial<Design>) => void;
}

export function DesignPreview({ design, onUpdate }: DesignPreviewProps) {
  const [extracting, setExtracting] = useState(false);

  const handleExtractColors = useCallback(async () => {
    setExtracting(true);
    try {
      const colors = await DesignsAPI.extractColors(design.previewUrl);
      onUpdate({ colorPalette: colors });
    } finally {
      setExtracting(false);
    }
  }, [design.previewUrl, onUpdate]);

  return (
    <Stack>
      <Image
        src={design.previewUrl}
        alt={design.name}
        fit="contain"
        height={400}
      />

      <Group spacing="xs">
        <Button
          leftIcon={<IconPalette size={16} />}
          variant="light"
          onClick={handleExtractColors}
          loading={extracting}
        >
          Extract Colors
        </Button>
      </Group>

      {design.colorPalette.length > 0 && (
        <Group spacing="xs">
          <Text size="sm" color="dimmed">Color Palette:</Text>
          {design.colorPalette.map(color => (
            <div
              key={color}
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                backgroundColor: color
              }}
            />
          ))}
        </Group>
      )}
    </Stack>
  );
}

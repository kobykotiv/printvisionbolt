import { Group, UnstyledButton, Popover, ColorSwatch, Stack, Text } from '@mantine/core';
import { useState } from 'react';

interface ColorPickerProps {
  value: string[];
  onChange: (colors: string[]) => void;
}

const PRESET_COLORS = [
  '#ff0000', '#00ff00', '#0000ff', '#ffff00',
  '#ff00ff', '#00ffff', '#000000', '#ffffff',
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [opened, setOpened] = useState(false);

  const toggleColor = (color: string) => {
    const newColors = value.includes(color)
      ? value.filter(c => c !== color)
      : [...value, color];
    onChange(newColors);
  };

  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start">
      <Popover.Target>
        <UnstyledButton>
          <Group spacing={4}>
            {value.map(color => (
              <ColorSwatch key={color} color={color} size={16} />
            ))}
            <Text size="sm" color="dimmed">
              {value.length ? `${value.length} colors` : 'Select colors'}
            </Text>
          </Group>
        </UnstyledButton>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack spacing="xs">
          <Text size="sm" weight={500}>Filter by colors</Text>
          <Group spacing={4}>
            {PRESET_COLORS.map(color => (
              <ColorSwatch
                key={color}
                color={color}
                size={24}
                onClick={() => toggleColor(color)}
                sx={{ cursor: 'pointer' }}
                className={value.includes(color) ? 'selected' : ''}
              />
            ))}
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

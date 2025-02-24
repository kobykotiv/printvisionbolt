import { Drawer, Stack } from '@mantine/core';
import { NavigationMenu } from './NavigationMenu';

interface MobileNavProps {
  opened: boolean;
  onClose: () => void;
}

export function MobileNav({ opened, onClose }: MobileNavProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      size="100%"
      padding="md"
      title="Menu"
      zIndex={1000}
    >
      <Stack spacing="xl">
        <NavigationMenu />
      </Stack>
    </Drawer>
  );
}

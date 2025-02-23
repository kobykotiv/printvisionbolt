import { Group, Button, Text, Menu } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';

interface BulkActionProps {
  selectedCount: number;
  actions: Array<{
    label: string;
    color?: string;
    onClick: () => void;
  }>;
}

export function BulkActionBar({ selectedCount, actions }: BulkActionProps) {
  if (selectedCount === 0) return null;

  return (
    <Group position="apart" p="md" bg="blue.1" style={{ borderRadius: 8 }}>
      <Text size="sm">
        {selectedCount} items selected
      </Text>
      <Group>
        {actions.slice(0, 2).map((action, index) => (
          <Button
            key={index}
            variant="light"
            color={action.color}
            onClick={action.onClick}
            size="sm"
          >
            {action.label}
          </Button>
        ))}
        {actions.length > 2 && (
          <Menu position="bottom-end">
            <Menu.Target>
              <Button variant="light" size="sm">
                <IconDots size={16} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {actions.slice(2).map((action, index) => (
                <Menu.Item
                  key={index}
                  onClick={action.onClick}
                  color={action.color}
                >
                  {action.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </Group>
  );
}

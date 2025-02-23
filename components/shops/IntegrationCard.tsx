import { Card, Group, Text, Badge, ActionIcon, Tooltip } from '@mantine/core';
import { IconTrash, IconRefresh } from '@tabler/icons-react';
import { ShopsAPI } from '@/lib/api/shops';
import type { PrintProviderIntegration } from '@/types/models';

interface IntegrationCardProps {
  integration: PrintProviderIntegration;
  shopId: string;
}

export function IntegrationCard({ integration, shopId }: IntegrationCardProps) {
  return (
    <Card withBorder>
      <Group position="apart">
        <Group>
          <Text weight={500}>{integration.provider}</Text>
          <Badge 
            color={integration.status === 'active' ? 'green' : 'red'}
          >
            {integration.status}
          </Badge>
        </Group>

        <Group spacing={8}>
          <Tooltip label="Test Connection">
            <ActionIcon 
              onClick={() => ShopsAPI.testIntegration(shopId, integration.provider)}
            >
              <IconRefresh size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Remove Integration">
            <ActionIcon 
              color="red"
              onClick={() => ShopsAPI.removeIntegration(shopId, integration.provider)}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      
      <Text size="sm" color="dimmed" mt="xs">
        Last synced: {new Date(integration.lastSync).toLocaleString()}
      </Text>
    </Card>
  );
}

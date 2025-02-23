import { Card, Stack, Title, Button, Group } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { IntegrationCard } from './IntegrationCard';
import { AddIntegrationModal } from './AddIntegrationModal';
import type { Shop, PrintProviderIntegration } from '@/types/models';

interface ShopIntegrationsProps {
  shop: Shop | null;
}

export function ShopIntegrations({ shop }: ShopIntegrationsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!shop) return null;

  return (
    <Card p="md">
      <Stack>
        <Group position="apart">
          <Title order={3}>Print Provider Integrations</Title>
          <Button 
            leftIcon={<IconPlus size={16} />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Integration
          </Button>
        </Group>

        <Stack>
          {shop.integrations.map((integration) => (
            <IntegrationCard 
              key={integration.provider} 
              integration={integration}
              shopId={shop.id}
            />
          ))}
        </Stack>
      </Stack>

      <AddIntegrationModal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shopId={shop.id}
        existingProviders={shop.integrations.map(i => i.provider)}
      />
    </Card>
  );
}

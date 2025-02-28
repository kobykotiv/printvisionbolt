import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Group, Title, Button, Modal, Grid, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ShopForm } from '@/components/shops/ShopForm';
import { ShopStats } from '@/components/shops/ShopStats';
import { ShopIntegrations } from '@/components/shops/ShopIntegrations';
import { ShopsAPI } from '@/lib/api/shops';
import type { Shop } from '@/types/models';

export default function ShopDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [shop, setShop] = useState<Shop | null>(null);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  
  const handleUpdate = async (data: Partial<Shop>) => {
    if (!id) return;
    try {
      const updated = await ShopsAPI.update(id as string, data);
      setShop(updated);
      closeEdit();
    } catch (error) {
      console.error('Failed to update shop:', error);
    }
  };

  return (
    <Stack spacing="xl">
      <Group position="apart">
        <Title order={2}>{shop?.name || 'Shop Details'}</Title>
        <Button onClick={openEdit}>Edit Shop</Button>
      </Group>

      <Grid>
        <Grid.Col span={8}>
          <Card p="md">
            <Stack>
              <Text size="sm" color="dimmed">Shop URL</Text>
              <Text>{shop?.url}</Text>
              <Text size="sm" color="dimmed">Contact Email</Text>
              <Text>{shop?.email}</Text>
              <Text size="sm" color="dimmed">Status</Text>
              <Text>{shop?.status}</Text>
            </Stack>
          </Card>
        </Grid.Col>
        
        <Grid.Col span={4}>
          <ShopStats shopId={id as string} />
        </Grid.Col>
      </Grid>

      <ShopIntegrations shop={shop} />

      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title="Edit Shop"
      >
        <ShopForm
          initialData={shop}
          onSubmit={handleUpdate}
        />
      </Modal>
    </Stack>
  );
}

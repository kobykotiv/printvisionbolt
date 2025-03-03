import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid, Card, Stack, Title, Group, Button, LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DesignPreview } from '@/components/designs/DesignPreview';
import { DesignForm } from '@/components/designs/DesignForm';
import { DesignsAPI } from '@/lib/api/designs';
import type { Design } from '@/types/models';

export default function DesignWorkspacePage() {
  const router = useRouter();
  const { id } = router.query;
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      DesignsAPI.get(id as string)
        .then(setDesign)
        .catch(() => notifications.show({
          title: 'Error',
          message: 'Failed to load design',
          color: 'red'
        }))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSave = async (data: Partial<Design>) => {
    if (!id) return;
    try {
      const updated = await DesignsAPI.update(id as string, data);
      setDesign(updated);
      notifications.show({
        title: 'Success',
        message: 'Design updated successfully',
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update design',
        color: 'red'
      });
    }
  };

  return (
    <Stack spacing="xl">
      <Group position="apart">
        <Title order={2}>{design?.name || 'Edit Design'}</Title>
        <Button onClick={() => router.push('/designs')}>Back to Designs</Button>
      </Group>

      <Grid>
        <Grid.Col span={8}>
          <Card p="md" style={{ position: 'relative', minHeight: '500px' }}>
            <LoadingOverlay visible={loading} />
            {design && <DesignPreview design={design} onUpdate={handleSave} />}
          </Card>
        </Grid.Col>
        
        <Grid.Col span={4}>
          <DesignForm design={design} onSubmit={handleSave} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

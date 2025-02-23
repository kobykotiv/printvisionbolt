import { Card, Group, Stack, Text, RingProgress } from '@mantine/core';
import { useState, useEffect } from 'react';
import { ShopsAPI } from '@/lib/api/shops';

interface ShopStatsProps {
  shopId: string;
}

export function ShopStats({ shopId }: ShopStatsProps) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    revenue: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await ShopsAPI.getStats(shopId);
        setStats(response);
      } catch (error) {
        console.error('Failed to fetch shop stats:', error);
      }
    }

    if (shopId) {
      fetchStats();
    }
  }, [shopId]);

  return (
    <Card p="md">
      <Stack>
        <Text weight={500}>Shop Statistics</Text>
        <Group position="apart">
          <Stack spacing={0}>
            <Text size="xl">{stats.totalProducts}</Text>
            <Text size="sm" color="dimmed">Total Products</Text>
          </Stack>
          <RingProgress
            size={80}
            thickness={8}
            sections={[
              {
                value: (stats.activeProducts / stats.totalProducts) * 100,
                color: 'blue'
              }
            ]}
            label={
              <Text align="center" size="xs">
                {Math.round((stats.activeProducts / stats.totalProducts) * 100)}%
                <br />
                Active
              </Text>
            }
          />
        </Group>
        <Group position="apart">
          <div>
            <Text size="xl">${stats.revenue.toFixed(2)}</Text>
            <Text size="sm" color="dimmed">Total Revenue</Text>
          </div>
          <div>
            <Text size="xl">{stats.totalOrders}</Text>
            <Text size="sm" color="dimmed">Total Orders</Text>
          </div>
        </Group>
      </Stack>
    </Card>
  );
}

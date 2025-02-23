import { useState, useCallback } from 'react';
import { Button, Group, TextInput, Select, Modal, Pagination, LoadingOverlay, Checkbox, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { CRUDTable } from '@/components/common/CRUDTable';
import { ShopForm } from '@/components/shops/ShopForm';
import { ShopsAPI } from '@/lib/api/shops';
import { BulkActionModal } from '@/components/shops/BulkActionModal';
import { BulkActionBar } from '@/components/common/BulkActionBar';
import type { Shop } from '@/types/models';
import { useRouter } from 'next/router';

export default function ShopsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);

  const fetchShops = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ShopsAPI.list({
        status,
        search: filter,
        page,
        limit: 10
      });
      setShops(response.data);
      setTotal(response.total);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch shops',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  }, [filter, status, page]);

  const handleCreate = async (data: Partial<Shop>) => {
    try {
      await ShopsAPI.create(data);
      notifications.show({
        title: 'Success',
        message: 'Shop created successfully',
        color: 'green'
      });
      close();
      fetchShops();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create shop',
        color: 'red'
      });
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedShops(checked ? shops.map(shop => shop.id) : []);
  };

  const handleSelectShop = (shopId: string, checked: boolean) => {
    setSelectedShops(prev => 
      checked ? [...prev, shopId] : prev.filter(id => id !== shopId)
    );
  };

  const columns = [
    {
      key: 'selection',
      label: <Checkbox
        onChange={(e) => handleSelectAll(e.currentTarget.checked)}
        checked={selectedShops.length === shops.length}
        indeterminate={selectedShops.length > 0 && selectedShops.length < shops.length}
      />,
      render: (_, shop) => (
        <Checkbox
          checked={selectedShops.includes(shop.id)}
          onChange={(e) => handleSelectShop(shop.id, e.currentTarget.checked)}
        />
      )
    },
    { key: 'name', label: 'Shop Name' },
    { key: 'status', label: 'Status' },
    { 
      key: 'integrations',
      label: 'Integrations',
      render: (integrations) => `${integrations.length} connected`
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      render: (date) => new Date(date).toLocaleDateString()
    }
  ];

  const bulkActions = [
    {
      label: 'Enable Selected',
      onClick: () => handleBulkStatusChange('active'),
    },
    {
      label: 'Disable Selected',
      onClick: () => handleBulkStatusChange('disabled'),
    },
    {
      label: 'Delete Selected',
      color: 'red',
      onClick: handleBulkDelete,
    },
    {
      label: 'Sync Selected',
      onClick: handleBulkSync,
    }
  ];

  async function handleBulkStatusChange(status: 'active' | 'disabled') {
    try {
      await ShopsAPI.bulkUpdate(selectedShops, { status });
      notifications.show({
        title: 'Success',
        message: `Updated ${selectedShops.length} shops`,
        color: 'green'
      });
      setSelectedShops([]);
      fetchShops();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update shops',
        color: 'red'
      });
    }
  }

  async function handleBulkDelete() {
    // Add confirmation dialog
    try {
      await Promise.all(selectedShops.map(id => ShopsAPI.delete(id)));
      notifications.show({
        title: 'Success',
        message: `Deleted ${selectedShops.length} shops`,
        color: 'green'
      });
      setSelectedShops([]);
      fetchShops();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete shops',
        color: 'red'
      });
    }
  }

  async function handleBulkSync() {
    // Implement sync logic
  }

  return (
    <Stack spacing="md">
      <BulkActionBar
        selectedCount={selectedShops.length}
        actions={bulkActions}
      />
      
      <Group position="apart" mb="lg">
        <Group>
          <TextInput
            placeholder="Search shops..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Select
            placeholder="Filter by status"
            value={status}
            onChange={setStatus}
            data={[
              { value: 'active', label: 'Active' },
              { value: 'disabled', label: 'Disabled' }
            ]}
          />
          {selectedShops.length > 0 && (
            <Button onClick={() => setBulkActionOpen(true)}>
              Bulk Actions ({selectedShops.length})
            </Button>
          )}
        </Group>
        <Button onClick={open}>New Shop</Button>
      </Group>
      
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <CRUDTable
          data={shops}
          columns={columns}
          onEdit={(shop) => router.push(`/shops/${shop.id}`)}
          onDelete={(shop) => console.log('Delete shop:', shop)}
        />
      </div>

      <Pagination
        total={Math.ceil(total / 10)}
        value={page}
        onChange={setPage}
        mt="md"
      />

      <Modal opened={opened} onClose={close} title="Create New Shop">
        <ShopForm onSubmit={handleCreate} />
      </Modal>

      <BulkActionModal
        opened={bulkActionOpen}
        onClose={() => setBulkActionOpen(false)}
        selectedShopIds={selectedShops}
        onComplete={() => {
          setSelectedShops([]);
          fetchShops();
        }}
      />
    </Stack>
  );
}

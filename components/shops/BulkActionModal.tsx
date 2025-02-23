import { Modal, Stack, Select, Button } from '@mantine/core';
import { useState } from 'react';
import { ShopsAPI } from '@/lib/api/shops';

interface BulkActionModalProps {
  opened: boolean;
  onClose: () => void;
  selectedShopIds: string[];
  onComplete: () => void;
}

export function BulkActionModal({ 
  opened, 
  onClose, 
  selectedShopIds,
  onComplete 
}: BulkActionModalProps) {
  const [action, setAction] = useState<string>('');

  const handleSubmit = async () => {
    switch (action) {
      case 'activate':
        await ShopsAPI.bulkUpdate(selectedShopIds, { status: 'active' });
        break;
      case 'deactivate':
        await ShopsAPI.bulkUpdate(selectedShopIds, { status: 'disabled' });
        break;
      case 'delete':
        await Promise.all(selectedShopIds.map(id => ShopsAPI.delete(id)));
        break;
    }
    onComplete();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Bulk Actions"
    >
      <Stack>
        <Select
          label="Select Action"
          value={action}
          onChange={(value) => setAction(value || '')}
          data={[
            { value: 'activate', label: 'Activate Shops' },
            { value: 'deactivate', label: 'Deactivate Shops' },
            { value: 'delete', label: 'Delete Shops' }
          ]}
        />
        <Button 
          color={action === 'delete' ? 'red' : 'blue'}
          onClick={handleSubmit}
          disabled={!action}
        >
          Apply to {selectedShopIds.length} shops
        </Button>
      </Stack>
    </Modal>
  );
}

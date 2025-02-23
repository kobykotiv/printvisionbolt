import { Modal, Stack, Select, TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ShopsAPI } from '@/lib/api/shops';
import type { PrintProviderIntegration } from '@/types/models';

interface AddIntegrationModalProps {
  opened: boolean;
  onClose: () => void;
  shopId: string;
  existingProviders: string[];
}

export function AddIntegrationModal({ 
  opened, 
  onClose, 
  shopId,
  existingProviders 
}: AddIntegrationModalProps) {
  const form = useForm({
    initialValues: {
      provider: '',
      apiKey: ''
    },
    validate: {
      provider: (value) => !value ? 'Provider is required' : null,
      apiKey: (value) => !value ? 'API Key is required' : null
    }
  });

  const availableProviders = [
    { value: 'printify', label: 'Printify' },
    { value: 'printful', label: 'Printful' },
    { value: 'gooten', label: 'Gooten' }
  ].filter(p => !existingProviders.includes(p.value));

  const handleSubmit = async (values: { provider: string; apiKey: string }) => {
    await ShopsAPI.addIntegration(shopId, {
      ...values,
      status: 'active',
      lastSync: new Date()
    } as PrintProviderIntegration);
    onClose();
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose}
      title="Add Print Provider Integration"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label="Provider"
            data={availableProviders}
            {...form.getInputProps('provider')}
          />
          <TextInput
            label="API Key"
            {...form.getInputProps('apiKey')}
          />
          <Button type="submit">Add Integration</Button>
        </Stack>
      </form>
    </Modal>
  );
}

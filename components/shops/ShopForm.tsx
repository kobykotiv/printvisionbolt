import { useForm } from '@mantine/form';
import { TextInput, Switch, Button, Stack, Select, Textarea } from '@mantine/core';
import type { Shop } from '@/types/models';

interface ShopFormProps {
  initialData?: Partial<Shop>;
  onSubmit: (data: Partial<Shop>) => void;
}

export function ShopForm({ initialData, onSubmit }: ShopFormProps) {
  const form = useForm({
    initialValues: {
      name: '',
      url: '',
      email: '',
      status: 'active',
      description: '',
      currency: 'USD',
      ...initialData
    },
    validate: {
      name: (value) => (!value ? 'Shop name is required' : null),
      url: (value) => {
        if (!value) return 'URL is required';
        try {
          new URL(value);
          return null;
        } catch {
          return 'Invalid URL';
        }
      },
      email: (value) => (
        !/^\S+@\S+$/.test(value) ? 'Invalid email' : null
      )
    }
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="md">
        <TextInput
          required
          label="Shop Name"
          {...form.getInputProps('name')}
        />
        
        <TextInput
          required
          label="Shop URL"
          {...form.getInputProps('url')}
        />

        <TextInput
          required
          label="Contact Email"
          {...form.getInputProps('email')}
        />

        <Select
          label="Currency"
          data={[
            { value: 'USD', label: 'US Dollar' },
            { value: 'EUR', label: 'Euro' },
            { value: 'GBP', label: 'British Pound' }
          ]}
          {...form.getInputProps('currency')}
        />

        <Textarea
          label="Description"
          {...form.getInputProps('description')}
        />

        <Switch
          label="Active"
          checked={form.values.status === 'active'}
          onChange={(event) => 
            form.setFieldValue('status', 
              event.currentTarget.checked ? 'active' : 'disabled'
            )
          }
        />

        <Button type="submit">Save Shop</Button>
      </Stack>
    </form>
  );
}

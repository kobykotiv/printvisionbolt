import { Stack, TextInput, MultiSelect, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import type { Design } from '@/types/models';

interface DesignFormProps {
  design: Design | null;
  onSubmit: (data: Partial<Design>) => void;
}

export function DesignForm({ design, onSubmit }: DesignFormProps) {
  const form = useForm({
    initialValues: {
      name: design?.name || '',
      description: design?.description || '',
      tags: design?.tags || []
    },
    validate: {
      name: (value) => !value ? 'Name is required' : null
    }
  });

  return (
    <Card p="md">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <TextInput
            label="Design Name"
            required
            {...form.getInputProps('name')}
          />
          
          <Textarea
            label="Description"
            minRows={3}
            {...form.getInputProps('description')}
          />

          <MultiSelect
            label="Tags"
            data={form.values.tags}
            value={form.values.tags}
            onChange={(value) => form.setFieldValue('tags', value)}
            searchable
            creatable
            getCreateLabel={(query) => `+ Create "${query}"`}
          />

          <Button type="submit">Save Changes</Button>
        </Stack>
      </form>
    </Card>
  );
}

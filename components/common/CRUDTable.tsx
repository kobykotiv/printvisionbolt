import { Table, ActionIcon, Group, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useCallback } from 'react';

interface CRUDTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: any) => ReactNode;
  }>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function CRUDTable<T extends { id: string }>({ 
  data, 
  columns, 
  onEdit, 
  onDelete 
}: CRUDTableProps<T>) {
  const handleEdit = useCallback((item: T) => {
    onEdit?.(item);
  }, [onEdit]);

  const handleDelete = useCallback((item: T) => {
    onDelete?.(item);
  }, [onDelete]);

  return (
    <Table>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key as string}>{col.label}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            {columns.map(col => (
              <td key={col.key as string}>
                {col.render ? col.render(item[col.key]) : 
                  <Text>{String(item[col.key])}</Text>}
              </td>
            ))}
            <td>
              <Group spacing={4}>
                <ActionIcon onClick={() => handleEdit(item)}>
                  <IconEdit size={18} />
                </ActionIcon>
                <ActionIcon color="red" onClick={() => handleDelete(item)}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Group>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

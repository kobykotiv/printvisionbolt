import { useState, useCallback, useEffect } from 'react';
import { Grid, Group, TextInput, MultiSelect, ActionIcon, Card, Image, Text, Badge, Checkbox, LoadingOverlay } from '@mantine/core';
import { IconSearch, IconAdjustments } from '@tabler/icons-react';
import { ColorPicker } from '@/components/designs/ColorPicker';
import type { Design } from '@/types/models';

export default function DesignsPage() {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchDesigns = useCallback(async () => {
    try {
      setLoading(true);
      const response = await DesignsAPI.list({
        search,
        tags: selectedTags,
        colors: selectedColors,
        page,
        limit: 12
      });
      setDesigns(response.data);
      setTotal(response.total);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch designs',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  }, [search, selectedTags, selectedColors, page]);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  return (
    <>
      <Group position="apart" mb="xl">
        <Group>
          <TextInput
            icon={<IconSearch size={16} />}
            placeholder="Search designs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <MultiSelect
            placeholder="Filter by tags"
            data={[]} // TODO: Fetch tags
            value={selectedTags}
            onChange={setSelectedTags}
          />
          <ColorPicker
            value={selectedColors}
            onChange={setSelectedColors}
          />
        </Group>
        <ActionIcon variant="filled" size="lg">
          <IconAdjustments size={20} />
        </ActionIcon>
      </Group>

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Grid>
          {designs.map((design) => (
            <Grid.Col key={design.id} span={3}>
              <Card shadow="sm">
                <Group position="right" mb="xs">
                  <Checkbox
                    checked={selectedDesigns.includes(design.id)}
                    onChange={(e) => {
                      setSelectedDesigns(prev =>
                        e.currentTarget.checked
                          ? [...prev, design.id]
                          : prev.filter(id => id !== design.id)
                      );
                    }}
                  />
                </Group>
                <Card.Section>
                  <Image
                    src={design.previewUrl}
                    height={200}
                    alt={design.name}
                  />
                </Card.Section>
                <Text weight={500} mt="sm">{design.name}</Text>
                <Group spacing={5} mt="xs">
                  {design.tags.map(tag => (
                    <Badge key={tag} size="sm">{tag}</Badge>
                  ))}
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </div>

      <Pagination
        total={Math.ceil(total / 12)}
        value={page}
        onChange={setPage}
        mt="xl"
      />
    </>
  );
}

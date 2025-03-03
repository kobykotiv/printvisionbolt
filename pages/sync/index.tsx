import { useState } from 'react';
import { Tabs, Card, Stack, Button, Text, Progress } from '@mantine/core';
import { SyncQueue } from '@/components/sync/SyncQueue';
import { SyncScheduler } from '@/components/sync/SyncScheduler';
import { useSyncOperations } from '@/hooks/useSyncOperations';

export default function SyncPage() {
  const [activeTab, setActiveTab] = useState<string>('queue');
  const { 
    syncAll,
    currentOperation,
    progress,
    isSyncing
  } = useSyncOperations();

  return (
    <Stack>
      <Group position="apart">
        <Text size="xl" weight={500}>Sync Operations</Text>
        <Button 
          onClick={syncAll}
          loading={isSyncing}
          disabled={isSyncing}
        >
          Sync Everything
        </Button>
      </Group>

      {currentOperation && (
        <Card p="md">
          <Text>{currentOperation}</Text>
          <Progress 
            value={progress} 
            animate={isSyncing}
            label={`${progress}%`}
          />
        </Card>
      )}

      <Tabs value={activeTab} onTabChange={(v) => setActiveTab(v || 'queue')}>
        <Tabs.List>
          <Tabs.Tab value="queue">Queue</Tabs.Tab>
          <Tabs.Tab value="schedule">Schedule</Tabs.Tab>
          <Tabs.Tab value="history">History</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="queue">
          <SyncQueue />
        </Tabs.Panel>
        <Tabs.Panel value="schedule">
          <SyncScheduler />
        </Tabs.Panel>
        <Tabs.Panel value="history">
          {/* Sync history component */}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

import { useState } from 'react';
import { Tabs, Card, Stack, Text, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { IntegrationSettings } from '@/components/settings/IntegrationSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { useSettings } from '@/hooks/useSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('account');
  const { settings, updateSettings, isLoading } = useSettings();

  const handleSave = async (section: string, data: any) => {
    try {
      await updateSettings(section, data);
      notifications.show({
        title: 'Success',
        message: 'Settings updated successfully',
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update settings',
        color: 'red'
      });
    }
  };

  return (
    <Stack>
      <Text size="xl" weight={500}>Settings</Text>
      
      <Tabs value={activeTab} onTabChange={(v) => setActiveTab(v || 'account')}>
        <Tabs.List>
          <Tabs.Tab value="account">Account</Tabs.Tab>
          <Tabs.Tab value="integrations">Integrations</Tabs.Tab>
          <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
          <Tabs.Tab value="api">API Keys</Tabs.Tab>
        </Tabs.List>

        <Card p="md" mt="md">
          <Tabs.Panel value="account">
            <AccountSettings
              settings={settings.account}
              onSave={(data) => handleSave('account', data)}
              isLoading={isLoading}
            />
          </Tabs.Panel>
          <Tabs.Panel value="integrations">
            <IntegrationSettings
              settings={settings.integrations}
              onSave={(data) => handleSave('integrations', data)}
              isLoading={isLoading}
            />
          </Tabs.Panel>
          <Tabs.Panel value="notifications">
            <NotificationSettings
              settings={settings.notifications}
              onSave={(data) => handleSave('notifications', data)}
              isLoading={isLoading}
            />
          </Tabs.Panel>
          <Tabs.Panel value="api">
            {/* API key management component */}
          </Tabs.Panel>
        </Card>
      </Tabs>
    </Stack>
  );
}

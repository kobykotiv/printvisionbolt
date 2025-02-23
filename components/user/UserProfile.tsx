import { Avatar, Menu, UnstyledButton, Group, Text, Divider } from '@mantine/core';
import { IconSettings, IconLogout, IconUser } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';

export function UserProfile() {
  const { logout, getUser } = useAuth();
  const user = getUser();

  if (!user) return null;

  return (
    <Menu width={200} position="bottom-end">
      <Menu.Target>
        <UnstyledButton>
          <Group>
            <Avatar src={user.avatar} radius="xl" />
            <div>
              <Text size="sm" weight={500}>
                {user.name}
              </Text>
              <Text size="xs" color="dimmed">
                {user.email}
              </Text>
            </div>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item icon={<IconUser size={14} />}>Profile</Menu.Item>
        <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
        <Divider />
        <Menu.Item 
          color="red" 
          icon={<IconLogout size={14} />}
          onClick={logout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

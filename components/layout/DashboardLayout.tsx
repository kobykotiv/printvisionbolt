import { ReactNode } from 'react';
import { AppShell, Navbar, Header, Group } from '@mantine/core';
import { NavigationMenu } from './NavigationMenu';
import { TopBar } from './TopBar';
import { UserProfile } from '@/components/user/UserProfile';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <NavigationMenu />
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Group position="apart">
            <TopBar />
            <UserProfile />
          </Group>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}

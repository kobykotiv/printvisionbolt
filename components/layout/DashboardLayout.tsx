import { ReactNode } from 'react';
import { AppShell, Navbar, Header } from '@mantine/core';
import { NavigationMenu } from './NavigationMenu';
import { TopBar } from './TopBar';

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
          <TopBar />
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}

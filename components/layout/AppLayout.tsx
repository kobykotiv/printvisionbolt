import { useEffect } from 'react';
import { AppShell, Navbar, Header, MediaQuery, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavigationMenu } from './NavigationMenu';
import { UserProfile } from '@/components/user/UserProfile';
import { ColorSchemeToggle } from '@/components/ui/ColorSchemeToggle';
import { useRouter } from 'next/router';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const router = useRouter();

  // Close mobile nav when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (mobileOpened) {
        toggleMobile();
      }
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [mobileOpened, toggleMobile, router]);

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!mobileOpened}
          width={{ sm: 200, lg: 300 }}
        >
          <NavigationMenu />
        </Navbar>
      }
      header={
        <Header height={{ base: 60 }} p="md">
          <Group position="apart">
            <Group>
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <Burger
                  opened={mobileOpened}
                  onClick={toggleMobile}
                  size="sm"
                  mr="xl"
                />
              </MediaQuery>
              <Text weight={700} size="lg">PrintVision.Cloud</Text>
            </Group>
            <Group>
              <ColorSchemeToggle />
              <UserProfile />
            </Group>
          </Group>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}

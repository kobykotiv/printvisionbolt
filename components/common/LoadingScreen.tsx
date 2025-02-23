import { Center, Loader, Stack, Text } from '@mantine/core';

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <Center style={{ height: '100vh' }}>
      <Stack align="center" spacing="xs">
        <Loader size="lg" />
        <Text size="sm" color="dimmed">{message}</Text>
      </Stack>
    </Center>
  );
}

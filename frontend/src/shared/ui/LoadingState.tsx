import { Spinner, Stack, Text } from '@chakra-ui/react';

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Wird geladen…' }: LoadingStateProps) {
  return (
    <Stack align="center" justify="center" py={16} gap={4}>
      <Spinner size="lg" color="blue.500" />
      <Text color="gray.500" fontSize="sm">
        {label}
      </Text>
    </Stack>
  );
}

import { Stack, Text } from '@chakra-ui/react';

type EmptyStateProps = {
  message?: string;
};

export function EmptyState({ message = 'Keine Einträge vorhanden.' }: EmptyStateProps) {
  return (
    <Stack align="center" justify="center" py={16}>
      <Text color="gray.400" fontSize="sm">
        {message}
      </Text>
    </Stack>
  );
}

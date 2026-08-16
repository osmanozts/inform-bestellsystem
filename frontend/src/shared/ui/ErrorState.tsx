import { Button, Stack, Text } from '@chakra-ui/react';

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  message = 'Ein Fehler ist aufgetreten.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Stack align="center" justify="center" py={16} gap={4}>
      <Text color="red.500" fontSize="sm">
        {message}
      </Text>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Erneut versuchen
        </Button>
      )}
    </Stack>
  );
}

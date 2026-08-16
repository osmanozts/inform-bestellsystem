import { useState } from 'react';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { useOrders } from '../hooks/index.ts';
import { EmptyState, ErrorState, LoadingState } from '../../../shared/ui/index.ts';
import { CreateOrderDialog, OrderTable } from '../components/index.ts';

export function OrdersPage() {
  const { data: orders, isLoading, isError, error, refetch } = useOrders();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md">Bestellungen</Heading>
        <Button colorPalette="blue" size="sm" onClick={() => setCreateOpen(true)}>
          Neue Bestellung
        </Button>
      </Flex>

      {isLoading && <LoadingState />}
      {isError && (
        <ErrorState message={error?.message} onRetry={() => void refetch()} />
      )}
      {!isLoading && !isError && orders?.length === 0 && (
        <EmptyState message="Noch keine Bestellungen vorhanden." />
      )}
      {!isLoading && !isError && orders && orders.length > 0 && (
        <OrderTable orders={orders} />
      )}

      <CreateOrderDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  );
}

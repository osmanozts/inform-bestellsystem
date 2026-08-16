import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrder } from '../hooks/index.ts';
import { useProducts } from '../../products/hooks/index.ts';
import { ErrorState, LoadingState } from '../../../shared/ui/index.ts';
import { OrderItemsTable } from '../components/index.ts';
import { formatCurrency } from '../../../shared/utils/index.ts';
import { formatOrderDate } from '../model/index.ts';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, error } = useOrder(id ?? '');
  const { data: products } = useProducts();

  return (
    <Box>
      <Flex align="center" gap={4} mb={6}>
        <Button size="sm" variant="outline" onClick={() => navigate('/orders')}>
          ← Zurück
        </Button>
        <Heading size="md">Bestelldetails</Heading>
      </Flex>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message={error?.message} />}

      {order && (
        <Stack gap={6}>
          <Box
            p={4}
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            bg="white"
          >
            <Stack gap={2}>
              <Flex gap={8}>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="semibold" textTransform="uppercase">
                    Bestell-ID
                  </Text>
                  <Text fontSize="sm" fontFamily="mono">
                    {order.id}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="semibold" textTransform="uppercase">
                    Datum
                  </Text>
                  <Text fontSize="sm">{formatOrderDate(order.createdAt)}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="semibold" textTransform="uppercase">
                    Benutzer-ID
                  </Text>
                  <Text fontSize="sm" fontFamily="mono">
                    {order.userId}
                  </Text>
                </Box>
              </Flex>
            </Stack>
          </Box>

          <Box>
            <Heading size="sm" mb={3}>
              Positionen
            </Heading>
            <OrderItemsTable items={order.items} products={products} />
          </Box>

          <Flex justify="flex-end">
            <Box
              px={6}
              py={3}
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              bg="white"
            >
              <Flex align="center" gap={4}>
                <Text fontWeight="semibold" color="gray.600">
                  Gesamtpreis
                </Text>
                <Text fontWeight="bold" fontSize="lg">
                  {formatCurrency(order.totalPrice)}
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Stack>
      )}
    </Box>
  );
}

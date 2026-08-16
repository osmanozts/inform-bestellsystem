import { useState } from 'react';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useProducts } from '../hooks/index.ts';
import { EmptyState, ErrorState, LoadingState } from '../../../shared/ui/index.ts';
import {
  DeleteProductDialog,
  ProductFormDialog,
  ProductTable,
} from '../components/index.ts';
import type { Product } from '../model/index.ts';

const PAGE_LIMIT = 8;

type FormDialogState = { open: boolean; product?: Product };

export function ProductsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useProducts(page, PAGE_LIMIT);
  const [formDialog, setFormDialog] = useState<FormDialogState>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const totalPages = data ? Math.ceil(data.total / PAGE_LIMIT) : 1;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md">Produkte</Heading>
        <Button colorPalette="blue" size="sm" onClick={() => setFormDialog({ open: true })}>
          Neues Produkt
        </Button>
      </Flex>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message={error?.message} onRetry={() => void refetch()} />}
      {!isLoading && !isError && data?.data.length === 0 && (
        <EmptyState message="Noch keine Produkte vorhanden." />
      )}
      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <ProductTable
            products={data.data}
            onEdit={(p) => setFormDialog({ open: true, product: p })}
            onDelete={(p) => setDeleteTarget(p)}
          />

          <Flex align="center" justify="space-between" mt={4}>
            <Text fontSize="sm" color="gray.500">
              {data.total} Produkt{data.total !== 1 ? 'e' : ''} gesamt
            </Text>
            <Flex align="center" gap={2}>
              <Button
                size="xs"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Zurück
              </Button>
              <Text fontSize="sm" color="gray.600">
                Seite {page} von {totalPages}
              </Text>
              <Button
                size="xs"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Weiter →
              </Button>
            </Flex>
          </Flex>
        </>
      )}

      <ProductFormDialog
        open={formDialog.open}
        product={formDialog.product}
        onClose={() => {
          setFormDialog({ open: false });
          setPage(1);
        }}
      />
      <DeleteProductDialog
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}

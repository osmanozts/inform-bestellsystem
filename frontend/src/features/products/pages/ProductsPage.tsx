import { useState } from 'react';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { useProducts } from '../hooks/index.ts';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../../../shared/ui/index.ts';
import {
  DeleteProductDialog,
  ProductFormDialog,
  ProductTable,
} from '../components/index.ts';
import type { Product } from '../model/index.ts';

type FormDialogState = { open: boolean; product?: Product };

export function ProductsPage() {
  const { data: products, isLoading, isError, error, refetch } = useProducts();
  const [formDialog, setFormDialog] = useState<FormDialogState>({
    open: false,
  });
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md">Produkte</Heading>
        <Button
          colorPalette="blue"
          size="sm"
          onClick={() => setFormDialog({ open: true })}
        >
          Neues Produkt
        </Button>
      </Flex>

      {isLoading && <LoadingState />}
      {isError && (
        <ErrorState
          message={error?.message}
          onRetry={() => void refetch()}
        />
      )}
      {!isLoading && !isError && products?.length === 0 && (
        <EmptyState message="Noch keine Produkte vorhanden." />
      )}
      {!isLoading && !isError && products && products.length > 0 && (
        <ProductTable
          products={products}
          onEdit={(p) => setFormDialog({ open: true, product: p })}
          onDelete={(p) => setDeleteTarget(p)}
        />
      )}

      <ProductFormDialog
        open={formDialog.open}
        product={formDialog.product}
        onClose={() => setFormDialog({ open: false })}
      />
      <DeleteProductDialog
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}

import { Button, Flex } from '@chakra-ui/react';
import { DataTable } from '../../../shared/ui/index.ts';
import type { Column } from '../../../shared/ui/index.ts';
import { formatCurrency } from '../../../shared/utils/index.ts';
import type { Product } from '../model/index.ts';

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export function ProductTable({ products, onEdit, onDelete }: Props) {
  const columns: Column<Product>[] = [
    { key: 'name', header: 'Name', render: (p) => p.name },
    {
      key: 'price',
      header: 'Preis',
      width: '140px',
      render: (p) => formatCurrency(p.price),
    },
    {
      key: 'stock',
      header: 'Bestand',
      width: '100px',
      render: (p) => p.stock,
    },
    {
      key: 'actions',
      header: '',
      width: '160px',
      render: (p) => (
        <Flex gap={1} justify="flex-end">
          <Button size="xs" variant="ghost" onClick={() => onEdit(p)}>
            Bearbeiten
          </Button>
          <Button
            size="xs"
            variant="ghost"
            colorPalette="red"
            onClick={() => onDelete(p)}
          >
            Löschen
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={products}
      keyExtractor={(p) => p.id}
    />
  );
}

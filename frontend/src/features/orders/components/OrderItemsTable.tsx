import { useMemo } from 'react';
import { DataTable } from '../../../shared/ui/index.ts';
import type { Column } from '../../../shared/ui/index.ts';
import { formatCurrency } from '../../../shared/utils/index.ts';
import type { OrderItem } from '../model/index.ts';
import type { Product } from '../../products/model/index.ts';

type Props = {
  items: OrderItem[];
  products?: Product[];
};

export function OrderItemsTable({ items, products }: Props) {
  const productMap = useMemo(
    () => new Map(products?.map((p) => [p.id, p]) ?? []),
    [products],
  );

  const columns: Column<OrderItem>[] = [
    {
      key: 'product',
      header: 'Produkt',
      render: (item) =>
        productMap.get(item.productId)?.name ?? `${item.productId.slice(0, 8)}…`,
    },
    {
      key: 'quantity',
      header: 'Menge',
      width: '90px',
      render: (item) => item.quantity,
    },
    {
      key: 'unitPrice',
      header: 'Einzelpreis',
      width: '130px',
      render: (item) => formatCurrency(item.unitPrice),
    },
    {
      key: 'subtotal',
      header: 'Zwischensumme',
      width: '140px',
      render: (item) => formatCurrency(item.subtotal),
    },
  ];

  return <DataTable columns={columns} rows={items} keyExtractor={(item) => item.id} />;
}

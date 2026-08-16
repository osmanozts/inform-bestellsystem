import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../../shared/ui/index.ts';
import type { Column } from '../../../shared/ui/index.ts';
import { formatCurrency } from '../../../shared/utils/index.ts';
import { formatOrderDate } from '../model/index.ts';
import type { Order } from '../model/index.ts';

type Props = { orders: Order[] };

export function OrderTable({ orders }: Props) {
  const navigate = useNavigate();

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Bestell-ID',
      width: '180px',
      render: (o) => `${o.id.slice(0, 8)}…`,
    },
    {
      key: 'createdAt',
      header: 'Datum',
      width: '160px',
      render: (o) => formatOrderDate(o.createdAt),
    },
    {
      key: 'positions',
      header: 'Positionen',
      width: '110px',
      render: (o) => o.items.length,
    },
    {
      key: 'total',
      header: 'Gesamtpreis',
      width: '130px',
      render: (o) => formatCurrency(o.totalPrice),
    },
    {
      key: 'actions',
      header: '',
      width: '100px',
      render: (o) => (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => navigate(`/orders/${o.id}`)}
        >
          Details
        </Button>
      ),
    },
  ];

  return <DataTable columns={columns} rows={orders} keyExtractor={(o) => o.id} />;
}

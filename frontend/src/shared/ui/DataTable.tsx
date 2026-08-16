import { Table } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  keyExtractor: (row: T) => string;
};

export function DataTable<T>({ columns, rows, keyExtractor }: DataTableProps<T>) {
  return (
    <Table.Root variant="outline" size="sm">
      <Table.Header>
        <Table.Row bg="gray.50">
          {columns.map((col) => (
            <Table.ColumnHeader key={col.key} width={col.width} fontWeight="semibold">
              {col.header}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={keyExtractor(row)} _hover={{ bg: 'gray.50' }}>
            {columns.map((col) => (
              <Table.Cell key={col.key}>{col.render(row)}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

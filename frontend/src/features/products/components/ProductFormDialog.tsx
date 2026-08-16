import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, Input, Stack } from '@chakra-ui/react';
import { FormField, toaster } from '../../../shared/ui/index.ts';
import { useCreateProduct, useUpdateProduct } from '../hooks/index.ts';
import { productSchema } from '../model/index.ts';
import type { Product, ProductFormValues } from '../model/index.ts';

type Props = {
  open: boolean;
  product?: Product;
  onClose: () => void;
};

export function ProductFormDialog({ open, product, onClose }: Props) {
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', price: 0, stock: 0 },
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isPending = createProduct.isPending || updateProduct.isPending;

  useEffect(() => {
    if (open) {
      reset(
        product
          ? { name: product.name, price: product.price, stock: product.stock }
          : { name: '', price: 0, stock: 0 },
      );
    }
  }, [open, product, reset]);

  const onSubmit = handleSubmit((values) => {
    if (isEdit) {
      updateProduct.mutate(
        { id: product.id, body: values },
        {
          onSuccess: () => {
            toaster.create({ type: 'success', title: 'Produkt aktualisiert.' });
            onClose();
          },
          onError: (err) => {
            toaster.create({ type: 'error', title: err.message });
          },
        },
      );
    } else {
      createProduct.mutate(values, {
        onSuccess: () => {
          toaster.create({ type: 'success', title: 'Produkt angelegt.' });
          onClose();
        },
        onError: (err) => {
          toaster.create({ type: 'error', title: err.message });
        },
      });
    }
  });

  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open: isOpen }) => !isOpen && onClose()}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>
              {isEdit ? 'Produkt bearbeiten' : 'Neues Produkt'}
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <form id="product-form" onSubmit={onSubmit}>
              <Stack gap={4}>
                <FormField label="Name" error={errors.name?.message} required>
                  <Input
                    {...register('name')}
                    placeholder='z.B. MacBook Pro 14"'
                  />
                </FormField>
                <FormField
                  label="Preis (€)"
                  error={errors.price?.message}
                  required
                >
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('price', { valueAsNumber: true })}
                  />
                </FormField>
                <FormField
                  label="Bestand"
                  error={errors.stock?.message}
                  required
                >
                  <Input
                    type="number"
                    min="0"
                    {...register('stock', { valueAsNumber: true })}
                  />
                </FormField>
              </Stack>
            </form>
          </Dialog.Body>
          <Dialog.Footer gap={2}>
            <Button variant="ghost" onClick={onClose} disabled={isPending}>
              Abbrechen
            </Button>
            <Button
              type="submit"
              form="product-form"
              colorPalette="blue"
              loading={isPending}
            >
              {isEdit ? 'Speichern' : 'Anlegen'}
            </Button>
          </Dialog.Footer>
          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

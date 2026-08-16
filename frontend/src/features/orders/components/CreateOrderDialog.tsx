import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Dialog, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import { FormField, toaster } from '../../../shared/ui/index.ts';
import { useCreateOrder } from '../hooks/index.ts';
import { useProducts } from '../../products/hooks/index.ts';
import { orderSchema } from '../model/index.ts';
import type { OrderFormValues } from '../model/index.ts';
import { formatCurrency } from '../../../shared/utils/index.ts';
import { useUser } from '../../../app/user-context.ts';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CreateOrderDialog({ open, onClose }: Props) {
  const { data: productsPage } = useProducts(1, 100);
  const products = productsPage?.data;
  const createOrder = useCreateOrder();
  const user = useUser();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { items: [{ productId: '', quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    if (open) reset({ items: [{ productId: '', quantity: 1 }] });
  }, [open, reset]);

  const onSubmit = handleSubmit((values) => {
    createOrder.mutate(
      { userId: user.id, items: values.items },
      {
        onSuccess: () => {
          toaster.create({ type: 'success', title: 'Bestellung erfolgreich aufgegeben.' });
          onClose();
        },
        onError: (err) => {
          toaster.create({ type: 'error', title: err.message });
        },
      },
    );
  });

  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open: isOpen }) => !isOpen && onClose()}
      size="lg"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Neue Bestellung</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body maxH="60vh" overflowY="auto">
            <form id="order-form" onSubmit={onSubmit}>
              <Stack gap={4}>
                {fields.map((field, index) => (
                  <Box
                    key={field.id}
                    p={3}
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                  >
                    <Flex gap={3} align="flex-start">
                      <Box flex={1}>
                        <FormField
                          label="Produkt"
                          error={errors.items?.[index]?.productId?.message}
                          required
                        >
                          <chakra.select
                            w="full"
                            px={3}
                            py="7px"
                            borderWidth="1px"
                            borderColor="gray.200"
                            borderRadius="md"
                            fontSize="sm"
                            bg="white"
                            {...register(`items.${index}.productId`)}
                          >
                            <option value="">– Produkt auswählen –</option>
                            {products?.map((p) => (
                              <option key={p.id} value={p.id} disabled={p.stock === 0}>
                                {p.name} — {formatCurrency(p.price)} ({p.stock} verfügbar)
                              </option>
                            ))}
                          </chakra.select>
                        </FormField>
                      </Box>
                      <Box w="100px">
                        <FormField
                          label="Menge"
                          error={errors.items?.[index]?.quantity?.message}
                          required
                        >
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                          />
                        </FormField>
                      </Box>
                      {fields.length > 1 && (
                        <Box pt={6}>
                          <Button
                            size="sm"
                            variant="ghost"
                            colorPalette="red"
                            onClick={() => remove(index)}
                          >
                            Entfernen
                          </Button>
                        </Box>
                      )}
                    </Flex>
                  </Box>
                ))}

                {errors.items?.root?.message && (
                  <Text fontSize="sm" color="red.500">
                    {errors.items.root.message}
                  </Text>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => append({ productId: '', quantity: 1 })}
                >
                  + Position hinzufügen
                </Button>
              </Stack>
            </form>
          </Dialog.Body>
          <Dialog.Footer gap={2}>
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={createOrder.isPending}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              form="order-form"
              colorPalette="blue"
              loading={createOrder.isPending}
            >
              Bestellen
            </Button>
          </Dialog.Footer>
          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

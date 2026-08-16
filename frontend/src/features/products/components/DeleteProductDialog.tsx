import { ConfirmDialog, toaster } from '../../../shared/ui/index.ts';
import { useDeleteProduct } from '../hooks/index.ts';
import type { Product } from '../model/index.ts';

type Props = {
  product: Product | null;
  onClose: () => void;
};

export function DeleteProductDialog({ product, onClose }: Props) {
  const deleteProduct = useDeleteProduct();

  const handleConfirm = () => {
    if (!product) return;
    deleteProduct.mutate(product.id, {
      onSuccess: () => {
        toaster.create({ type: 'success', title: 'Produkt gelöscht.' });
        onClose();
      },
      onError: (err) => {
        toaster.create({ type: 'error', title: err.message });
      },
    });
  };

  return (
    <ConfirmDialog
      open={!!product}
      title="Produkt löschen"
      description={`Möchtest du "${product?.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`}
      confirmLabel="Löschen"
      isLoading={deleteProduct.isPending}
      onConfirm={handleConfirm}
      onClose={onClose}
    />
  );
}

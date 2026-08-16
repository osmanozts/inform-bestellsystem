import { Order } from './order.entity';
import { Product } from '../../../product/domain/entities/product.entity';
import { InsufficientStockError } from '../../../product/domain/errors/product.errors';
import { OrderProductNotFoundError } from '../errors/order.errors';

describe('Order', () => {
  const makeProduct = (overrides: Partial<{ id: string; price: number; stock: number }> = {}) =>
    Product.create({
      id: overrides.id ?? 'product-1',
      name: 'Test Product',
      price: overrides.price ?? 10.0,
      stock: overrides.stock ?? 10,
    });

  const makeOrder = (products: Product[], items: Array<{ productId: string; quantity: number }>) =>
    Order.create({ id: 'order-1', userId: 'user-1', items }, products);

  describe('create', () => {
    it('historizes unitPrice from the product at order time', () => {
      const product = makeProduct({ price: 9.99 });
      const order = makeOrder([product], [{ productId: 'product-1', quantity: 1 }]);

      expect(order.items[0].unitPrice).toBe(9.99);
    });

    it('keeps the historized unitPrice even after product price would change', () => {
      const product = makeProduct({ id: 'p-1', price: 50.0 });
      const order = makeOrder([product], [{ productId: 'p-1', quantity: 2 }]);

      // unitPrice is a snapshot — unaffected by any later product change
      expect(order.items[0].unitPrice).toBe(50.0);
    });

    it('computes totalPrice as the sum of all item subtotals', () => {
      const p1 = makeProduct({ id: 'p-1', price: 10.0, stock: 10 });
      const p2 = makeProduct({ id: 'p-2', price: 5.0, stock: 10 });
      const order = makeOrder(
        [p1, p2],
        [
          { productId: 'p-1', quantity: 2 }, // 20.00
          { productId: 'p-2', quantity: 3 }, // 15.00
        ],
      );

      expect(order.totalPrice).toBe(35.0);
    });

    it('reduces stock on each product when the order is created', () => {
      const product = makeProduct({ stock: 8 });
      makeOrder([product], [{ productId: 'product-1', quantity: 3 }]);

      expect(product.stock).toBe(5);
    });

    it('throws OrderProductNotFoundError when a requested product is not in the list', () => {
      const product = makeProduct({ id: 'other-id' });

      expect(() =>
        makeOrder([product], [{ productId: 'unknown-id', quantity: 1 }]),
      ).toThrow(OrderProductNotFoundError);
    });

    it('throws InsufficientStockError when quantity exceeds available stock', () => {
      const product = makeProduct({ stock: 2 });

      expect(() =>
        makeOrder([product], [{ productId: 'product-1', quantity: 5 }]),
      ).toThrow(InsufficientStockError);
    });
  });
});

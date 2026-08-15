import { Product } from './product.entity';
import {
  InsufficientStockError,
  InvalidPriceError,
  InvalidProductNameError,
  InvalidStockError,
} from '../errors/product.errors';

describe('Product', () => {
  const validProps = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Test Product',
    price: 9.99,
    stock: 10,
  };

  describe('create', () => {
    it('creates a valid product', () => {
      const product = Product.create(validProps);
      expect(product.name).toBe('Test Product');
      expect(product.price.getAmount()).toBe(9.99);
      expect(product.stock).toBe(10);
    });

    it('trims whitespace from name', () => {
      const product = Product.create({ ...validProps, name: '  Widget  ' });
      expect(product.name).toBe('Widget');
    });

    it('throws InvalidProductNameError for empty name', () => {
      expect(() => Product.create({ ...validProps, name: '' })).toThrow(
        InvalidProductNameError,
      );
    });

    it('throws InvalidProductNameError for whitespace-only name', () => {
      expect(() => Product.create({ ...validProps, name: '   ' })).toThrow(
        InvalidProductNameError,
      );
    });

    it('throws InvalidPriceError for negative price', () => {
      expect(() => Product.create({ ...validProps, price: -1 })).toThrow(
        InvalidPriceError,
      );
    });

    it('throws InvalidStockError for negative stock', () => {
      expect(() => Product.create({ ...validProps, stock: -1 })).toThrow(
        InvalidStockError,
      );
    });

    it('allows zero price', () => {
      const product = Product.create({ ...validProps, price: 0 });
      expect(product.price.getAmount()).toBe(0);
    });

    it('allows zero stock', () => {
      const product = Product.create({ ...validProps, stock: 0 });
      expect(product.stock).toBe(0);
    });
  });

  describe('decreaseStock', () => {
    it('decreases stock by quantity', () => {
      const product = Product.create(validProps);
      product.decreaseStock(3);
      expect(product.stock).toBe(7);
    });

    it('allows decreasing stock to zero', () => {
      const product = Product.create(validProps);
      product.decreaseStock(10);
      expect(product.stock).toBe(0);
    });

    it('throws InsufficientStockError when quantity exceeds stock', () => {
      const product = Product.create(validProps);
      expect(() => product.decreaseStock(11)).toThrow(InsufficientStockError);
    });
  });

  describe('increaseStock', () => {
    it('increases stock by quantity', () => {
      const product = Product.create(validProps);
      product.increaseStock(5);
      expect(product.stock).toBe(15);
    });
  });
});

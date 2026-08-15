import {
  InsufficientStockError,
  InvalidProductNameError,
  InvalidStockError,
} from '../errors/product.errors';
import { Money } from '../value-objects/money.vo';
import { ProductId } from '../value-objects/product-id.vo';

interface ProductProps {
  id: ProductId;
  name: string;
  price: Money;
  stock: number;
}

export class Product {
  private readonly _id: ProductId;
  private _name: string;
  private _price: Money;
  private _stock: number;

  private constructor(props: ProductProps) {
    this._id = props.id;
    this._name = props.name;
    this._price = props.price;
    this._stock = props.stock;
  }

  static create(props: {
    id: string;
    name: string;
    price: number;
    stock: number;
  }): Product {
    if (!props.name || props.name.trim().length === 0) {
      throw new InvalidProductNameError();
    }
    if (props.stock < 0) {
      throw new InvalidStockError(props.stock);
    }
    return new Product({
      id: ProductId.create(props.id),
      name: props.name.trim(),
      price: Money.create(props.price),
      stock: props.stock,
    });
  }

  decreaseStock(quantity: number): void {
    if (quantity > this._stock) {
      throw new InsufficientStockError(this._stock, quantity);
    }
    this._stock -= quantity;
  }

  increaseStock(quantity: number): void {
    this._stock += quantity;
  }

  get id(): ProductId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): Money {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }
}

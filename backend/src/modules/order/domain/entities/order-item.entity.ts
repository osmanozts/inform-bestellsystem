import { InvalidQuantityError } from '../errors/order.errors';

export class OrderItem {
  private constructor(
    private readonly _id: string,
    private readonly _productId: string,
    private readonly _quantity: number,
    private readonly _unitPrice: number,
  ) {}

  static create(props: {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
  }): OrderItem {
    if (props.quantity < 1) {
      throw new InvalidQuantityError(props.quantity);
    }
    return new OrderItem(
      props.id,
      props.productId,
      props.quantity,
      props.unitPrice,
    );
  }

  get id(): string {
    return this._id;
  }
  get productId(): string {
    return this._productId;
  }
  get quantity(): number {
    return this._quantity;
  }
  get unitPrice(): number {
    return this._unitPrice;
  }
  get subtotal(): number {
    return this._quantity * this._unitPrice;
  }
}

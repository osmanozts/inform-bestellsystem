import { Product } from '../../../product/domain/entities/product.entity';
import { OrderProductNotFoundError } from '../errors/order.errors';
import { OrderId } from '../value-objects/order-id.vo';
import { OrderItem } from './order-item.entity';

export class Order {
  private constructor(
    private readonly _id: OrderId,
    private readonly _userId: string,
    private readonly _items: OrderItem[],
    private readonly _createdAt: Date,
  ) {}

  static create(
    props: {
      id: string;
      userId: string;
      items: Array<{ productId: string; quantity: number }>;
    },
    products: Product[],
  ): Order {
    const productMap = new Map(products.map((p) => [p.id.getValue(), p]));

    const orderItems = props.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new OrderProductNotFoundError(item.productId);
      }
      product.decreaseStock(item.quantity);

      return OrderItem.create({
        id: crypto.randomUUID(),
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price.getAmount(),
      });
    });

    return new Order(
      OrderId.create(props.id),
      props.userId,
      orderItems,
      new Date(),
    );
  }

  static reconstitute(props: {
    id: string;
    userId: string;
    createdAt: Date;
    items: Array<{
      id: string;
      productId: string;
      quantity: number;
      unitPrice: number;
    }>;
  }): Order {
    const items = props.items.map((item) => OrderItem.create(item));
    return new Order(
      OrderId.create(props.id),
      props.userId,
      items,
      props.createdAt,
    );
  }

  get id(): OrderId {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get items(): OrderItem[] {
    return [...this._items];
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get totalPrice(): number {
    return this._items.reduce((sum, item) => sum + item.subtotal, 0);
  }
}

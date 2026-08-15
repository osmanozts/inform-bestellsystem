export class OrderId {
  private constructor(private readonly value: string) {}

  static create(value: string): OrderId {
    if (!value || value.trim().length === 0) {
      throw new Error('OrderId must not be empty.');
    }
    return new OrderId(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: OrderId): boolean {
    return this.value === other.value;
  }
}

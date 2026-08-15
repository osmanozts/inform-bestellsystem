export class ProductId {
  private constructor(private readonly value: string) {}

  static create(value: string): ProductId {
    if (!value || value.trim().length === 0) {
      throw new Error('ProductId must not be empty.');
    }
    return new ProductId(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ProductId): boolean {
    return this.value === other.value;
  }
}

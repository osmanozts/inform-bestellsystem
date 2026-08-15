import { InvalidPriceError } from '../errors/product.errors';

export class Money {
  private constructor(private readonly amount: number) {}

  static create(amount: number): Money {
    if (amount < 0) {
      throw new InvalidPriceError(amount);
    }
    return new Money(amount);
  }

  getAmount(): number {
    return this.amount;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount;
  }
}

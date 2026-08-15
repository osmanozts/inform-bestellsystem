export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidProductNameError extends DomainError {
  constructor() {
    super('Product name must not be empty.');
  }
}

export class InvalidPriceError extends DomainError {
  constructor(value: number) {
    super(`Price must be >= 0, got ${value}.`);
  }
}

export class InvalidStockError extends DomainError {
  constructor(value: number) {
    super(`Stock must be >= 0, got ${value}.`);
  }
}

export class InsufficientStockError extends DomainError {
  constructor(available: number, requested: number) {
    super(
      `Insufficient stock: available ${available}, requested ${requested}.`,
    );
  }
}

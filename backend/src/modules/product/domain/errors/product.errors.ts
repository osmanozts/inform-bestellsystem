import {
  ConflictDomainError,
  NotFoundDomainError,
  ValidationDomainError,
} from '../../../../shared/domain/errors/domain.error';

export class InvalidProductNameError extends ValidationDomainError {
  constructor() {
    super('Product name must not be empty.');
  }
}

export class InvalidPriceError extends ValidationDomainError {
  constructor(value: number) {
    super(`Price must be >= 0, got ${value}.`);
  }
}

export class InvalidStockError extends ValidationDomainError {
  constructor(value: number) {
    super(`Stock must be >= 0, got ${value}.`);
  }
}

export class InsufficientStockError extends ConflictDomainError {
  constructor(available: number, requested: number) {
    super(
      `Insufficient stock: available ${available}, requested ${requested}.`,
    );
  }
}

export class ProductNotFoundError extends NotFoundDomainError {
  constructor(id: string) {
    super(`Product with id "${id}" not found.`);
  }
}

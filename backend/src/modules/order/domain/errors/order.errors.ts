import {
  NotFoundDomainError,
  ValidationDomainError,
} from '../../../../shared/domain/errors/domain.error';

export class OrderNotFoundError extends NotFoundDomainError {
  constructor(id: string) {
    super(`Order with id "${id}" not found.`);
  }
}

export class OrderProductNotFoundError extends NotFoundDomainError {
  constructor(productId: string) {
    super(`Product with id "${productId}" not found.`);
  }
}

export class InvalidQuantityError extends ValidationDomainError {
  constructor(value: number) {
    super(`Quantity must be >= 1, got ${value}.`);
  }
}

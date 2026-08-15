export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export abstract class NotFoundDomainError extends DomainError {}
export abstract class ValidationDomainError extends DomainError {}
export abstract class ConflictDomainError extends DomainError {}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  DomainError,
  InsufficientStockError,
  InvalidPriceError,
  InvalidProductNameError,
  InvalidStockError,
  ProductNotFoundError,
} from '../../modules/product/domain/errors/product.errors';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const { status, error } = this.resolve(exception);

    response.status(status).json({ statusCode: status, error, message: exception.message });
  }

  private resolve(exception: DomainError): { status: number; error: string } {
    if (exception instanceof ProductNotFoundError) {
      return { status: HttpStatus.NOT_FOUND, error: 'Not Found' };
    }
    if (
      exception instanceof InvalidProductNameError ||
      exception instanceof InvalidPriceError ||
      exception instanceof InvalidStockError
    ) {
      return { status: HttpStatus.BAD_REQUEST, error: 'Bad Request' };
    }
    if (exception instanceof InsufficientStockError) {
      return { status: HttpStatus.CONFLICT, error: 'Conflict' };
    }

    this.logger.error('Unhandled domain error', exception);
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'Internal Server Error' };
  }
}

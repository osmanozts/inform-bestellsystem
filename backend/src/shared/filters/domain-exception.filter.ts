import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ConflictDomainError,
  DomainError,
  NotFoundDomainError,
  ValidationDomainError,
} from '../domain/errors/domain.error';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const { status, error } = this.resolve(exception);

    response
      .status(status)
      .json({ statusCode: status, error, message: exception.message });
  }

  private resolve(exception: DomainError): { status: number; error: string } {
    if (exception instanceof NotFoundDomainError) {
      return { status: HttpStatus.NOT_FOUND, error: 'Not Found' };
    }
    if (exception instanceof ValidationDomainError) {
      return { status: HttpStatus.BAD_REQUEST, error: 'Bad Request' };
    }
    if (exception instanceof ConflictDomainError) {
      return { status: HttpStatus.CONFLICT, error: 'Conflict' };
    }

    this.logger.error('Unhandled domain error', exception);
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
    };
  }
}

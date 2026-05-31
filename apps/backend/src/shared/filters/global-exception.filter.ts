import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const message =
        typeof payload === 'string'
          ? payload
          : (payload as { message?: string | string[] }).message;

      response.status(status).json({
        statusCode: status,
        message: Array.isArray(message) ? message.join(', ') : (message ?? 'Solicitud invalida.'),
        path: request.url,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    this.logger.error('Unhandled exception', exception);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Ocurrio un error interno al procesar la solicitud.',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

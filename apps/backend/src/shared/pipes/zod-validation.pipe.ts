import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema, ZodTypeDef, z } from 'zod';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T, ZodTypeDef, unknown>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (result.success) {
      return result.data;
    }

    const message = result.error.issues
      .map((issue) => {
        const path = issue.path.join('.');
        return path ? `${path}: ${issue.message}` : issue.message;
      })
      .join(', ');

    throw new BadRequestException(message || 'Solicitud invalida.');
  }
}

export { z };

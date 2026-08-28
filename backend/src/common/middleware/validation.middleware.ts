import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../errors/app-error';

type ValidationTarget = 'body' | 'query' | 'params';

export function validate(schema: Joi.ObjectSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message.replace(/"/g, "'"),
      }));

      next(
        AppError.badRequest('Validation failed', details),
      );
      return;
    }

    // Assign the sanitized/coerced value back
    req[target] = value;
    next();
  };
}

// Develop vmgabriel

import { Request, Response, NextFunction } from 'express';

const boom = require('@hapi/boom');
import Joi = require('@hapi/joi');

// Interfaces
import { IErrorCustom } from '../../interfaces/error-custom';

/**
 * Validate Content of Joi
 * @param data Data for joi Content
 * @param schema Schem to do validation
 */
export function validate(data: any, schema: any) {
  let result: Joi.ValidationResult;
  result = Joi.object(schema).validate(data);
  return result.error;
}

/**
 * Validation Error Center
 * @param schema Schema data
 * @param check check data schema
 */
export function validationHandler(schema: any, check: string  = 'body'): any {
  return function(err: IErrorCustom, req: Request, res: Response, next: NextFunction) {
    if (!!err) {
      next(err);
    } else {
      const error = validate(req[check], schema);
      error ? next(boom.badRequest(error)) : next();
    }
  };
}

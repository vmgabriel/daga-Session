// Develop vmgabriel

import { Request, Response, NextFunction } from 'express';

const boom = require('@hapi/boom');
const joi = require('@hapi/joi');

/**
 * Validate Content of Joi
 * @param data Data for joi Content
 * @param schema Schem to do validation
 */
export function validate(data: any, schema: any) {
  const { error } = joi.validate(data, schema);
  return error;
}

/**
 * Validation Error Center
 * @param schema Schema data
 * @param check check data schema
 */
export function validationHandler(schema: any, check = 'body') {
  return function(req: Request, res: Response, next: NextFunction) {
    const error = validate(req[check], schema);

    error ? next(boom.badRequest(error)) : next();
  }
}

// Develop: vmgabriel

// Libraries
import { Request, Response, NextFunction } from 'express';

// Interfaces
import { IErrorCustom } from '../../interfaces/error-custom';

// boom
const boom = require('@hapi/boom');

// Configuration
import config from '../../config';

/**
 * Return stack of Errors
 * @param err Errors in Matery
 * @param stack stack in Matery
 */
function withErrorStack(err: Array<any>, stack: any) {
  switch (config.dev.toLowerCase()) {
    case 'dev':
    case 'develop':
    case 'development':
    case 'testing':
    case 'test':
      return { ...err, stack };
    case 'production':
    default:
      return err;
  }
}

/**
 * Show errors in console for develop
 * @params err {IErrorCustom} err Type for use in Errors
 * @params req {Request} req Express method for middleware consult
 * @params res {Response} res Express method for middleware consult
 * @params next {NextFunction} next Express method for middleware consult
 */
export function logErrors(
  err: IErrorCustom,
  req: Request,
  res: Response,
  next: NextFunction) {
  console.log('[Error: LogError] - ', err);
  next(err);
}

/**
 * Data WrapError for hapi boom
 * @param err error
 * @param req request of Express
 * @param res response of Express
 * @param next next of Express
 */
export function wrapErrors(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction) {
  if (err.hasOwnProperty('isBoom')) {
    next(boom.badImplementation(err));
  }

  next(err);
}


/**
 * Error Handler of Data Errors In Server
 * @param err error
 * @param req request of Express
 * @param res response of Express
 * @param next next of Express
 */
export function errorhandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction) {
  if (err.hasOwnProperty('output')) {
    const { output: { statusCode, payload } } = err;
    res.status(statusCode);
    res.json(withErrorStack(payload, err.stack));
  }
  next(err);
}

/**
 * Show message Error for user
 * @params err {IErrorCustom} err Type for use in Errors
 * @params req {Request} req Express method for middleware consult
 * @params res {Response} res Express method for middleware consult
 * @params next {NextFunction} next Express method for middleware consult
 */
export function clientErrorHandler(
  err: IErrorCustom,
  req: Request,
  res: Response,
  next: NextFunction) {
  console.log('[Error: clientError] - ', err);

  let errorResponse: IErrorCustom = {
    code: err.code || 500,
    error: err.error,
    message: err.message ||  "An error ocurrs"
  };

  res.status(errorResponse.code).json(errorResponse);
}

module.exports = {
  logErrors,
  clientErrorHandler,
  wrapErrors,
  errorhandler
};

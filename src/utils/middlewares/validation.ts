// Develop vmgabriel

// Libraries
import { Request, Response, NextFunction } from "express";

// Constants
import config from "../../config";

// Authenticate
import authStrategy from '../auth';

// Interfaces
import { IErrorCustom } from '../../interfaces/error-custom';

/**
 * Auth Client Middlware
 * @param req
 * @param res
 * @param next
 */
export const authClient = (req: Request, res: Response, next: NextFunction) => {
  authStrategy.authenticate(req, res, next);
};
/**
 * Middlware for Verify Authorization of route
 * @param module
 * @param permission
 */
export const verifyAuthorization = (
  module: string,
  permission: string
) => (err: IErrorCustom, req: Request, res: Response, next: NextFunction) => {
  console.log("Error - ", err);
  if (!!err) {
    next(err);
  } else {
    authStrategy.authorize(
      req,
      res,
      next,
      module,
      permission
    );
  }
}

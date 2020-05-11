// Develop vmgabriel

// Libraries
import { Request, Response, NextFunction } from "express";

// Constants
import config from "../../config";

/**
 * Auth Client Middlware
 * @param req
 * @param res
 * @param next
 */
const authClient = (req: Request, res: Response, next: NextFunction) => {
  if (!req.signedCookies || !req.signedCookies.hasOwnProperty('auth')) {
    next({ code: 403, message: 'auth not send', error: 'auth not send' });
  }

  console.log('signed cookies', req.signedCookies);
  next();
};

export default authClient;

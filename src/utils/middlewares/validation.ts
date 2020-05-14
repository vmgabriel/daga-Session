// Develop vmgabriel

// Libraries
import { Request, Response, NextFunction } from "express";

// Constants
import config from "../../config";

// Authenticate
import authStrategy from '../auth';

/**
 * Auth Client Middlware
 * @param req
 * @param res
 * @param next
 */
const authClient = (req: Request, res: Response, next: NextFunction) => {
  if (!req.signedCookies || !req.signedCookies[config.cookieName]) {
    next({ code: 403, message: 'auth not send', error: 'auth not send' });
  }

  authStrategy.authenticate(req, res, next);
};

export default authClient;

// Develop vmgabriel

// Libraries
import { Request, Response, NextFunction } from "express";

// Constants
import config from "../../config";

const authClient = (req: Request, res: Response, next: NextFunction) => {
  if (!req.signedCookies || !req.signedCookies['auth']) {
    // res.status(403).send();
    next({ code: 403, message: 'auth not send', error: 'auth not send' });
  }

  console.log('signed cookies', req.signedCookies);
  next();
};

export default authClient;

// Libraries
import { Router, Request, Response, NextFunction } from "express";
import auth from '../utils/auth';

// Base router Dependency
import { RouteBase } from './route';

/** Route for Auth  */
export class AuthRoutes extends RouteBase {
  /** Initialize data  */
  constructor() {
    super(Router(), '/api/v0/auth/');

    this.config();
  }

  /** Configuration of Routes  */
  protected config() {
    this.generateLogin();
  }

  /** Route of Login  */
  public generateLogin() {
    this.router.post('', (
      req: Request,
      res: Response,
      next: NextFunction
    ) => auth.login(req, res, next));
  }
}

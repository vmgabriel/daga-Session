// Develop vmgabriel

// Libraries
import { Router, Request, Response, NextFunction } from "express";
import auth from '../utils/auth';

// Validators
import { validationHandler } from '../utils/validations/validatorHandler';

// Base router Dependency
import { RouteBase } from './route';

// Auth Model
import { SessionModel } from '../models/session';
import { ISession, nameTable } from "../interfaces/session";

/** Route for Auth  */
export class AuthRoutes extends RouteBase<ISession> {
  private sessionModel: SessionModel;
  /** Initialize data  */
  constructor() {
    super(
      Router(),
      '/api/v0/auth/',
      nameTable
    );

    this.sessionModel = new SessionModel();

    this.config();
  }

  /** Configuration of Routes  */
  protected config() {
    this.generateLogin();
    this.generateAuth();
  }

  /** Route of Login  */
  public generateLogin() {
    this.router.post(
      '',
      validationHandler(this.sessionModel.getCreateScheme()),
      (
        req: Request,
        res: Response,
        next: NextFunction
      ) => auth.login(req, res, next));
  }

  /** Route of Login  */
  public generateAuth() {
    this.router.post('/validate', (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      // if (req.path.includes(process.env.API_BASE + 'login')) return next();
      res.send('ok');
    });
  }

  // End Class
}

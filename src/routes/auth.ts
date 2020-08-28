// Develop vmgabriel

// Libraries
import { Router, Request, Response, NextFunction } from "express";
import auth from '../utils/auth';

// Validators
import { validationHandler } from '../utils/validations/validatorHandler';
import { authClient } from '../utils/middlewares/validation';

// Base router Dependency
import { RouteBase } from './route';

// Auth Model
import { SessionModel } from '../models/session';
import { ISession, nameTable } from "../interfaces/session";

// Services
import { SessionService } from '../services/session';

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
    this.service = new SessionService();

    this.config();
  }

  /** Configuration of Routes  */
  protected config() {
    this.generateLogin();
    this.generateAuth();
    this.getMe();
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

  /** Route of Login  */
  public getMe() {
    this.router.get(
      '/me',
      authClient,
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const { id } = req.headers.info as any;
          const { rows } = await this.service.getOne(id as string);
          res.status(200).send({ code: 200, message: 'Data Correctly', data: rows });
        } catch(err) {
          console.log('Error - ', err);
          next(err);
        }
      })
    ;
  }

  // End Class
}

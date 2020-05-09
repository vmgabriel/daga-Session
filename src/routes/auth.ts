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
    this.generateAuth();
  }

  /** Route of Login  */
  public generateLogin() {
    this.router.post('', (
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

      return auth.authenticate((err: any, user: any, info: any) => {
        if (err) { return next(err); }
        if (!user) {
          if (info.name === 'TokenExpiredError') {
            return res.status(401).json({
              message: 'Your token has expired. Please generate a new one'
            });
          } else {
            return res.status(401).json({ message: info.message });
          }
        }
        return next();
      })(req, res, next);
    });
  }

  // End Class
}

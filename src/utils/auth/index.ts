// Develop vmgabriel
import * as express from 'express';
import * as passport from 'passport';
import * as jwt from 'jwt-simple';
import * as cookieStrategy from 'passport-cookie';
import * as moment from 'moment';
import * as expressValidator from 'express-validator';

// Configuration
import config from '../../config';

/** Auth Strategies of Connection  */
class AuthStrategy {

  /** Define Strateties  */
  constructor() {
  }

  /** Define strategies  */
  public initialize() {
    passport.use(new cookieStrategy(this.strategyCookie));
    return passport.initialize();
  }

  /** get Token  */
  private genToken () {
    const token = jwt.encode({
      exp: moment().utc().add({ hours: 1 }).unix(),
      username: 'usuario'
    }, config.jwtSecret);

    return token;
  }

  /**
   * Get Login Strategy
   * @param req request of express
   * @param res response of express
   * @param next next of express
   */
  public login(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      expressValidator.body('username').notEmpty();
      expressValidator.body('password').notEmpty();

      let errors = expressValidator.validationResult(req);
      if (!errors['errors']) { throw errors['errors']; }

      const options = {
        maxAge: 1000 * 60 * 15, // 15 minutes
        httpOnly: true,
        // secure: true,
        signed: true
      };
      res
        .status(200)
        .cookie('auth', this.genToken(), options)
        .send({ code: 200, message: 'Data Correctly' });
    } catch (err) {
      console.log(err);
      res.status(401).json({ "message": "Invalid credentials", "errors": err });
    }
  }

  /**
   * Stratetie Cookie Connection
   * @param token Token defined
   * @param done Done Defined
   */
  public strategyCookie (token: any, done: any) {
    console.log('token -', token);
    return (err: any, user: any) => {
      if (err) { return done(err); }
      // if (!user) { return done(null, false); }
      return done(null, { user: 'usuario', data: 'data', usuario: user });
    };
  };
  // End Class
}

const authStrategy = new AuthStrategy();
export default authStrategy;

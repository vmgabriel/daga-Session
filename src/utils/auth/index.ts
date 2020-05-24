// Develop vmgabriel
import * as express from 'express';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import * as passportJWT from 'passport-jwt';
import * as jwt from 'jwt-simple';
import * as moment from 'moment';
import * as R from 'ramda';
//const CookieStrategy = require('passport-cookie');

// Configuration
import config from '../../config';

// Services
import { SessionService } from '../../services/session';
import { BlackListService } from '../../services/blacklist';

/** Auth Strategies of Connection  */
class AuthStrategy {
  private sessionService: SessionService;
  private blackListService: BlackListService;

  private localStrategy: any;
  private jwtStrategy: any;

  constructor() {
    this.sessionService = new SessionService();
    this.blackListService = new BlackListService();

    this.localStrategy = passportLocal.Strategy;
    this.jwtStrategy = passportJWT.Strategy;
  }

  /** Initialize the Password  */
  public initialize() {
    passport.use(new this.jwtStrategy({
      jwtFromRequest: (req: any) => req.signedCookies[config.cookieName],
      secretOrKey: config.jwtSecret,
    }, (
      jwtPayload: any,
      done: any
    ) => {
      if (jwtPayload.expires > Date.now()) {
        return done('jwt expired');
      }

      return done(null, jwtPayload);
    }));

    passport.use(new this.localStrategy({
      usernameField: 'username',
      passwordField: 'password',
    }, async (
      username: any,
      password: any,
      done : any
    ) => {
      console.log('Hello new');
      try {
        // const { data, valid, sessionId } = await this.sessionService.compareSession({
        //   sessionUserName: username,
        //   sessionPassword: password
        // });

        // console.log("datos de la consulta - ", { data, valid, sessionId });

        // return (valid) ? done(null, { data, sessionId }) : done(data);
      } catch (error) {
        done(error);
      }
    }));

    return passport.initialize();
  }

  /**
   * Gen Token of all user
   * @param ip ip of user
   * @param user name of user
   * @param role role of user
   * @param id id of user
   */
  private genToken (ip: string, user: string, role: string, id: string) {
    const token = jwt.encode({
      exp: moment().utc().add({ hours: 1 }).unix(),
      id,
      username: user,
      ip,
      role
    }, config.jwtSecret);

    return token;
  }

  /**
   * Authenticate user
   * @param req express request
   * @param res express response
   * @param next express nextfunction
   */
  public async authenticate(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    passport.authenticate('jwt', async (error, info) => {
      if (error || !info) { res.status(403).json({ error }); }
      next();
    })(req, res, next);
  }

  /**
   * Get Login Strategy
   * @param req request of express
   * @param res response of express
   * @param next next of express
   */
  public async login(req: express.Request, res: express.Response, next: express.NextFunction) {
    passport.authenticate('local', { session: false }, async (error, user) => {
      try {
        // if (error || !user) { res.status(400).json({ error }); }

        // const options = {
        //   maxAge: 1000 * 60 * 15, // 15 minutes
        //   httpOnly: true,
        //   signed: true// ,
        //   //secure: true
        // };

        // const {
        //   row
        // } = await this.sessionService.getSessionComplete(user.sessionId);

        // // #TODO: GET User data of service of user sync

        // const token = this.genToken(
        //   req.connection.remoteAddress,
        //   row[0].sessionUserName,
        //   row[0].sessionRole,
        //   user.sessionId
        // );

        // // Create New BlackList
        // const blackListItem = {
        //   blackListToken: token,
        //   blackListIp: req.connection.remoteAddress,
        //   blackListBrowser: req.headers['user-agent'],
        //   blackListDateUse: new Date()
        // };
        // const blackCreated = await this.blackListService.create(blackListItem);

        // // load Strategie for Authenticate
        // const strategieResolve = await this.strategyAuthentication(
        //   blackListItem.blackListIp,
        //   user.sessionId,
        //   blackListItem.blackListBrowser,
        //   blackCreated,
        //   row[0].blacklists
        // );

        // if (strategieResolve.code ===  409) {
        //   res.status(409).json(strategieResolve);
        // }

        // // Append to List the new Item
        // row[0].blacklists.push(blackListItem);

        // R.forEach((data: any) => delete data.blackListToken, row[0].blacklists);

        // console.log("token - ", token);

        // res
        //   .status(200)
        //   .cookie(config.cookieName, token, options)
        //   .send({ code: 200, message: 'Data Correctly', data: row[0] });
      } catch (err) {
        console.log('[Error login] - ', err);
        res.status(401).json({ "message": "Invalid credentials", "errors": err });
      }
    })(req, res, next);
  }

  /**
   * Strategy pf authentication
   * @param ip ip of user
   * @param idSession id of session
   * @param browser browser of user connected
   * @param newItem a new item of blackList
   * @param list list of blacklists
   */
  private strategyAuthentication(
    ip: string,
    idSession: string,
    browser: string,
    newItem: any,
    list: Array<any>
  ): Promise<{ code: number, message: string }> {
    const maxSessions = parseInt(config.maxSession);
    return new Promise(async (resolve: any, reject: any) => {
      try {
        if (maxSessions < list.length) {
          const message = 'You have exhausted the maximum number of sessions allowed';
          resolve({ code: 409, message:  message });
        }
        if (R.includes({ blackListIp: ip }, list)) {
          if (R.includes({ blackListBrowser: browser }, list)) {
            // Is Equal
            // Delete BlackList Item or deactivate
            const blackListFilter = (R.filter(
              (data: any) => data.blackListIp === ip && data.blackListBrowser === browser,
              list
            ))[0];
            const blaclistDeactivate = await this.blackListService.delete(blackListFilter.id);
            console.log('token deactivated - ', blaclistDeactivate);
          }
        } else {
          // #TODO: report ACCESS INTO event
        }
        // Add new BlackList Item
        //await this.sessionService.reportNewAuth(idSession, newItem.rows.id);
        resolve({ code: 200, message: 'token refresh' });
      } catch (err) {
        reject(err);
      }
    });
  }

  // End Class
}

const authStrategy = new AuthStrategy();
export default authStrategy;

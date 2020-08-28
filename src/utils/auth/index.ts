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

// Interfaces
import { IBlackList } from '../../interfaces/blacklist';
import { ISession } from '../../interfaces/session';
import { IRoleModule } from '../../interfaces/role';

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
      try {
        const { data, valid, sessionId } = await this.sessionService.compareSession({
          sessionUserName: username,
          sessionPassword: password
        });

        return (valid) ? done(null, { data, sessionId }) : done({ data, valid });
      } catch (error) {
        done(error);
      }
    }));

    return passport.initialize();
  }

  /**
   * Get Permission of a token
   * @param perms Array of perms converted
   */
  private getPermissions(perms: Array<IRoleModule>): string {
    const getPermission = (perm: IRoleModule) => {
      const getTwoFirstsLetters = (word: string) => R.map(
        (w: string) => w.charAt(0),word.split(' ')
      ).join();
      const getAccess = (access: Array<string>) => R.map(getTwoFirstsLetters, access).join('.');
      const withoutSpaces = (word: string) => word.split(' ').join('_');
      return getAccess(perm.roleModulePermission) + '-' + withoutSpaces(perm.roleModuleId['moduleName']);
    };
    return R.map(getPermission, perms).join('|');
  }

  /**
   * Gen Token of all user
   * @param ip ip of user
   * @param user name of user
   * @param role role of user
   * @param id id of user
   * @param perms Permissions of user with token defined
   */
  private genToken (
    ip: string,
    user: string,
    role: string,
    id: string,
    perms: Array<IRoleModule>
  ) {
    const token = jwt.encode({
      exp: moment().utc().add({ hours: 1 }).unix(),
      id,
      username: user,
      ip,
      role,
      permission: this.getPermissions(perms)
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
      req.headers.info = info;
      if (error || !info) { next({ code: 403, error }); }
      next();
    })(req, res, next);
  }

  /**
   * Authorize access to certain thinkgs
   * @param req Request of Express
   * @param res Response of Express
   * @param next NextFunction of Express
   * @param module Name of Module
   * @param permission Permission of Module
   */
  public async authorize(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
    module: string,
    permission: string
  ) {
    passport.authenticate('jwt', async (error, info) => {
      console.log('data');
      if (error || !info) { next({ code: 403, error }); return; }

      const getTwoFirstsLetters = (word: string) => R.map(
        (w: string) => w.charAt(0),word.split(' ')
      ).join();
      const compose = (...fns: Array<any>) => (x: any) => fns.reduceRight((y,f) => f(y), x);
      const verifyModule = (mod: string) => ([_, b]) => b === mod;
      const separeFor = (separation: string) => (word: string) => word.split(separation);
      const verifyPermission = (permission: string) => (arr: Array<string>) => {
        if (arr.length == 0)
          return false
        if (arr.length == 1)
          return arr[0] == permission
        const [itm, ...nArr] = arr;
        return itm == permission || verifyPermission(permission)(nArr);
      };

      let permUser = compose(separeFor('|'))(info.permission);
      permUser = R.map(compose(separeFor('-')), permUser);

      const accessValid = R.filter(verifyModule(module), permUser);
      if (accessValid.length == 1) {
        if (verifyPermission(getTwoFirstsLetters(permission))(accessValid[0][0].split('.'))) {
          next();
        } else {
          //res.status(403).json({ code: 403, message: 'Not Permitted.' });
          next({ code: 403, message: 'Not Permitted.' });
        }
      } else {
        //res.status(403).json({ code: 403, message: 'Not Permitted.' });
        next({ code: 403, message: 'Not Permitted.' });
      }
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
        if (error || !user) {
          next({ code: 401, message: error.data, valid: error.valid });
          return;
        }

        const options = {
          maxAge: 1000 * 60 * 15, // 15 minutes
          httpOnly: true,
          signed: true// ,
          //secure: true
        };

        const { rows } = await this.sessionService.getOne(user.sessionId);
        const row = rows as ISession;

        // #TODO: GET User data of service of user sync

        const token = this.genToken(
          req.connection.remoteAddress,
          row.sessionUserName,
          row.sessionRole['_id'],
          user.sessionId,
          row.sessionRole['roleModules']
        );

        // Create New BlackList
        const blackListItem = {
          blackListToken: token,
          blackListIp: req.connection.remoteAddress,
          blackListBrowser: req.headers['user-agent'],
          blackListDateUse: new Date()
        };
        const blackCreated = await this.blackListService.create(blackListItem);

        // load Strategie for Authenticate
        const strategieResolve = await this.strategyAuthentication(
          blackListItem.blackListIp,
          user.sessionId,
          blackListItem.blackListBrowser,
          blackCreated,
          row.sessionBlackList
        );

        if (strategieResolve.code ===  409) {
          next({ code: 409, message: strategieResolve })
        }

        // Append to List the new Item
        row.sessionBlackList.push(blackListItem as IBlackList);

        R.forEach((data: any) => delete data._doc.blackListToken, row.sessionBlackList);

        res
          .status(200)
          .cookie(config.cookieName, token, options)
          .send({ code: 200, message: 'Data Correctly', data: row });
      } catch (err) {
        console.log('[Error login] - ', err);
        next({ code: 401, message: "Invalid credentials", errors: err });
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
        await this.sessionService.createBlackListReference(idSession, newItem.rows._id);
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

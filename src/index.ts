// Develop vmgabriel

// Use Libraries
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
// import * as methodOverride from 'method-override';

// Configuration for NODE_ENV
import envalid from './utils/env';

// Constants
import config from './config';

// Auth
import auth from './utils/auth';
import authClient from './utils/middlewares/validation';

// Verify Connection
import dbConnect from './utils/db/couch';

// Configuration of Routes
import { RouteBase } from './routes/route';
import { IndexRoutes } from './routes';
import { AuthRoutes } from './routes/auth';
import { ModuleRoutes } from './routes/module';
import { RoleRoutes } from './routes/role';

// Middleware of Output
import { notFound } from './utils/middlewares/not-found';
import {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  errorhandler
} from './utils/middlewares/error-handlers';


/** Server Class Init */
class Server {
  public app: express.Express;
  private env: any;
  private corsOptions: cors.CorsOptions;

  private indexRoute: RouteBase;
  private loginRoute: AuthRoutes;

  // Routes Class
  private routes: Array<RouteBase>;

  constructor() {
    // Create Express Application
    this.app = express();
    dbConnect.initialize();

    // Validate Environment
    this.env = envalid;

    // CoreOptions
    this.corsOptions = {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    };

    // Initialize Routes
    this.routes = [
      new ModuleRoutes(),
      new RoleRoutes()
    ];
    this.indexRoute = new IndexRoutes();
    this.loginRoute = new AuthRoutes();

    // Configuration of server
    this.config();

    // Activate Routes
    this.router();

    // control Errors and Output Data
    this.exitProcess();
  }

  /** Configuration Method of Server */
  private config() {
    dotenv.config();
    this.app.use(bodyParser.json());
    this.app.use(cookieParser(config.cookieSecret));
    this.app.use(helmet());
    this.app.use(cors(this.corsOptions));
    //this.app.use(methodOverride());
    this.app.use(auth.initialize());


    this.app.set('port', config.port || 7200);
  }

  /**
   *  Configure the routes of my app
   */
  private router() {
    // Swagger Docs
    this.app.use(`${this.indexRoute.uri}`, this.indexRoute.router);
    this.app.use(`${this.loginRoute. uri}`, this.loginRoute.router);

    this.app.use(authClient);

    for (let route of this.routes) {
      this.app.use(`${route.uri}`, route.router);
    }
  }

  /** Method that control process of exit in middleware of service  */
  private exitProcess() {
    this.app.use(notFound);
    this.app.use(logErrors);
    this.app.use(wrapErrors);
    this.app.use(errorhandler);
    this.app.use(clientErrorHandler);
  }

  /**
   * Open Server
   * @param isSecure Data of know if use https or http
   */
  public open(isSecure: boolean = false) {
    let server: any;
    if (isSecure) {
      server = true;
    } else {
      server = this.app.listen(this.app.get("port"), () => {
        console.log(`Listening on http://localhost:${this.app.get("port")}`);
        process.on("SIGINT", () => {
          console.log("Bye bye!");
          process.exit();
        });
      });
    }
    // End Method Open
  }

  // End Class Server
}

// Initialize for server and open
const server = new Server();
server.open(config.isHttps === 'true');

// For funtionality of test
module.exports = server.app;

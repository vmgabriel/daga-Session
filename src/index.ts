// Develop vmgabriel

// Use Libraries
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv';
import * as swaggerUi from 'swagger-ui-express';
import * as cors from 'cors';

// Configuration for NODE_ENV
import envalid from './utils/env';

// Constants
import config from './config';

/** Server Class Init */
class Server {
  public app: express.Application;
  private env: any;
  private corsOptions: cors.CorsOptions;

  constructor() {
    // Create Express Application
    this.app = express();

    // Validate Environment
    this.env = envalid;

    // CoreOptions
    this.corsOptions = {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    };

    // Configuration of server
    this.config();
  }

  /** Configuration Method of Server */
  private config() {
    dotenv.config();
    this.app.use(bodyParser.json());
    this.app.use(helmet());
    this.app.use(cors(this.corsOptions));

    this.app.set('port', config.port || 7200)
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
  }

  // End Class Server
}

// Initialize for server and open
const server = new Server();
server.open(config.isHttps === 'true');

// For funtionality of test
module.exports = server.app;

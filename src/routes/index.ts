// Libraries
import * as express from "express";

// Base router Dependency
import { RouteBase } from './route';

/**
 * Route base
 **/
export class IndexRoutes extends RouteBase {

  /**
   * Extends RouteApi with super construct and put uri
   **/
  constructor() {
    super(express.Router(), '/api/v0/');

    this.config();
  }

  /**
   *  Configure the routes of my indexRoute
   **/
  public config(): void {
    this.showBaseApi();
    this.showAboutApi();

    // End config function
  }

  /**
   * Method for show Base Api
   **/
  public showBaseApi() {
    this.router.get(
      "/",
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.send({ message: 'API - Daga' });
      }
    );
  }

  /**
   * Route for get /about -> default route for know api
   **/
  public showAboutApi() {
    this.router.get(
      "/about",
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let message = "Made In Colombia for Daga Project ";
        message += "\nGabriel Vargas Monroy(VMGabriel)";
        res.send({ message });
      }
    );
  }

  // End Class
}

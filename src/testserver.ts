// Develop vmgabriel

import * as express from 'express';
import * as supertest from 'supertest';

import { ModuleRoutes } from './routes/module';

import { RouteBase } from './routes/route';
import { IAbstract } from './interfaces/abtract';

/**
 * Data for test server
 * @param datas data row
 */
export function testServer(datas: Array<RouteBase<IAbstract>>) {

  const app = express();

  for (let data of datas) {
    app.use(`${data.uri}`, data.router);
  }

  return supertest(app);
}

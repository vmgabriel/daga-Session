// Develop vmgabriel

import * as dotenv from 'dotenv';
import * as envalid from 'envalid';

// Enable configuration of dotenv
dotenv.config();

/**
 * envalid behavior for env vars
 * @param  process.env vars env
 */
const env = envalid.cleanEnv(process.env, {
  PORT: envalid.port(),

  USE_HTTPS: envalid.bool(),
  JWT_SECRET: envalid.str(),
  COOKIE_SECRET: envalid.str(),

  nameDocumentDevelop: envalid.str(),
  nameDocumentProduction: envalid.str(),
  nameDocumentTest: envalid.str(),

  HOST_DB: envalid.host(),
  PORT_DB: envalid.port(),
  USER_DB: envalid.str(),
  PASS_DB: envalid.str(),

  COOKIE_NAME: envalid.str(),
  MAXSESSIONBYUSER: envalid.num()
});

export default env;

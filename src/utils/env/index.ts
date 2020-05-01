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

  USE_HTTPS: envalid.bool()
});

export default env;

// Develop vmgabriel

import * as dotenv from 'dotenv';

// Enavle configuration of dotEnv
dotenv.config();

const config = {
  dev: process.env.NODE_ENV,
  port: process.env.PORT,
  isHttps: process.env.USE_HTTPS,

  nameDocDev: process.env.nameDocumentDevelop,
  nameDocProd: process.env.nameDocumentProduction,
  nameDocTest: process.env.nameDocumentTest,

  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,

  hostDb: process.env.HOST_DB,
  portDb: process.env.PORT_DB,
  userDb: process.env.USER_DB,
  passDb: process.env.PASS_DB,

  cookieName: process.env.COOKIE_NAME,
  maxSession: process.env.MAXSESSIONBYUSER
};

export default config;

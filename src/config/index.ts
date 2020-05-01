// Develop vmgabriel

import * as dotenv from 'dotenv';

// Enavle configuration of dotEnv
dotenv.config();

const config = {
  dev: process.env.NODE_ENV !== "production",
  port: process.env.PORT,
  isHttps: process.env.USE_HTTPS
};

export default config;

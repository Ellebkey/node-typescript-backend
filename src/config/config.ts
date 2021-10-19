import { resolve } from 'path';
import joi from 'joi';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '../../.env') });

const envVarsSchema = joi.object({
  NODE_ENV: joi.string()
    .allow(['development', 'production', 'test'])
    .default('development'),
  PORT: joi.number()
    .default(4040),
  JWT_SECRET: joi.string().required()
    .description('JWT Secret required to sign'),
  SQL_HOST: joi.string().required()
    .description('SQL DB host url'),
  SQL_DB: joi.string().required()
    .description('SQL DB name'),
  SQL_USER: joi.string().required()
    .description('SQL DB user'),
  SQL_PASSWORD: joi.string().required()
    .description('SQL DB password'),
  SQL_PORT: joi.number()
    .default(3306),
  MONGO_HOST: joi.string().required()
    .description('SQL DB host url'),
  MONGO_DB: joi.string().required()
    .description('SQL DB name'),
  MONGO_USER: joi.string().required()
    .description('SQL DB user'),
  MONGO_PASSWORD: joi.string().required()
    .description('SQL DB password'),
  MONGO_PORT: joi.number()
    .default(27017),
}).unknown().required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envConfig = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  sql: {
    host: envVars.SQL_HOST,
    port: envVars.SQL_PORT,
    user: envVars.SQL_USER,
    password: envVars.SQL_PASSWORD,
    db: envVars.SQL_DB,
  },
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
    user: envVars.MONGO_USER,
    password: envVars.MONGO_PASSWORD,
    db: envVars.MONGO_DB,
  },
  MAX_POOL: 10,
  MIN_POOL: 1,
};

export default envConfig;

import { connect, set } from 'mongoose';
import envConfig from './config';
import { logger } from './logger';

export default class MongoDB {
  db: string;
  user: string;
  password: string;
  host: string;
  port: number;

  constructor() {
    this.db = envConfig.mongo.db;
    this.user = envConfig.mongo.user;
    this.password = envConfig.mongo.password;
    this.host = envConfig.mongo.host;
    this.port = Number(envConfig.mongo.port);
  }

  initDataBase = async (): Promise<void> => {
    logger.info('Initializing MongoDB Database');
    const mongoUri = `mongodb://${this.user}:${this.password}@${this.host}:${this.port}/${this.db}`;
    try {
      set('debug', (collectionName, method, query, doc) => {
        logger.verbose(`
          ${collectionName}.${method}
          ${JSON.stringify(query)}
          ${JSON.stringify(doc)}`);
      });

      connect(mongoUri, { useUnifiedTopology: true });

      logger.info('MongoDB Database synchronized');
    } catch (e) {
      logger.error(e);
    }
  };
}

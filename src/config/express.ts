import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import expressWinston from 'express-winston';
import { errorMiddleware, notFound, converterErr } from '@middlewares/error';
import { logger, output } from './logger';
import IndexRoute from '../index.route';
import envConfig from './config';

export default class ExpressServer {
  app: express.Express;

  constructor() {
    this.app = express();
    this.middlewareSetup();
    this.routingSetup();
  }

  private middlewareSetup() {
    // Setup requests gZip compression
    this.app.use(compression());

    // Setup common security protection
    this.app.use(helmet());

    // Setup Cross Origin access
    this.app.use(cors());

    // Setup requests format parsing (Only JSON requests will be valid)
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    this.app.use(cookieParser());

    if (envConfig.env === 'development' || envConfig.env === 'test') {
      expressWinston.requestWhitelist.push('body');
      expressWinston.responseWhitelist.push('body');
      this.app.use(expressWinston.logger({
        level: 'http',
        winstonInstance: logger,
        msg: output,
      }));
    }
  }

  private routingSetup() {
    // Add to server routes
    this.app.use('/api', new IndexRoute().router);
    this.app.use(converterErr);
    this.app.use(notFound);
    this.app.use(errorMiddleware);
  }
}

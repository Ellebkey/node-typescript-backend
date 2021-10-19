import { Request, Response, NextFunction } from 'express';
import APIError from '@utils/APIError';
import envConfig from '@config/config';
import { logger } from '@config/logger';

export const converterErr = (err: APIError, req: Request, res: Response, next: NextFunction): void => {
  let convertedError = err;

  if (!(convertedError instanceof APIError)) {
    const errorInfo = {
      tag: err.tag || 'unexpected-error',
      message: err.message || 'An unexpected error occurred',
      status: err.status || 500,
      stack: err.stack,
    };
    convertedError = new APIError(
      errorInfo.tag,
      errorInfo.message,
      errorInfo.status,
      errorInfo.stack,
    );
  }

  if (err.name.includes('Sequelize')) {
    convertedError.tag = 'sequelize-error';
    convertedError.status = 500;
  }

  return errorMiddleware(convertedError, req, res, next);
};

export const errorMiddleware = (err: APIError, req: Request, res: Response, next: NextFunction):void => {
  const response = {
    status: err.status || 500,
    message: err.message,
    tag: err.tag || 'api-error',
    stack: err.stack,
  };

  if (envConfig.env !== 'development') {
    delete response.stack;
  }
  logger.error(err);

  res.status(response.status);
  res.json(response);
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const err = new APIError(
    'not-found',
    'API Not found',
    404,
  );
  return errorMiddleware(err, req, res, next);
};

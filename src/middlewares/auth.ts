import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import envConfig from '@config/config';
import APIError from '@utils/APIError';
import { UserPayload } from '@interfaces/user.interfaces';

/**
 * Middleware to validate user token
 */
let jwtSecret: string;
export default class Auth {
  constructor() {
    jwtSecret = envConfig.jwtSecret;
  }

  public checkAuth(req: Request, res: Response, next: NextFunction): void {
    const apiError = new APIError(
      'unauthorized',
      'User Unauthorized',
      401,
      undefined,
    );

    if (typeof req.headers.authorization !== 'undefined') {
      try {
        req.user = jwt.verify(req.headers.authorization, jwtSecret) as UserPayload;
        return next();
      } catch (err) {
        apiError.stack = err.stack;

        if (err.name === 'TokenExpiredError') {
          apiError.message = 'Need to login again!';
          apiError.tag = 'expired-token';
        } else if (err.name === 'JsonWebTokenError') {
          apiError.message = 'Failed to authenticate token!';
          apiError.tag = 'failed-token';
          apiError.status = 400;
        }

        return next(apiError);
      }
    }
    apiError.message = 'User is not logged, you need a token!';
    return next(apiError);
  }
}

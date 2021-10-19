import joi from 'joi';
import _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import APIError from '@utils/APIError';

/**
 * Middleware to validate req body, params and query with joi
 */
export class JoiValidation {
  public checkValidation = (joiObject: any) => (
    req: Request, res: Response, next: NextFunction,
  ): void => {
    const apiError = new APIError(
      'validation-error',
      'Validation Error',
      500,
      undefined,
    );

    const data = { body: req.body, query: req.query, params: req.params, headers: req.headers };

    const validate = joi.validate(data, joiObject, { abortEarly: false, allowUnknown: true });

    if (validate.error) {
      const errorMessage = _
        .chain(validate.error.details)
        .map((o, idx) => `${idx + 1}. ${o.message}`)
        .value();

      apiError.message = _.join(errorMessage, '\n').replace(/['"]+/g, '');
      return next(apiError);
    }
    return next();
  };
}

export default JoiValidation;

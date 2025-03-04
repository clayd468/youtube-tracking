import { Response } from 'express';
import { ValidationError } from 'express-validation';
import httpStatus from 'http-status';

/**
 * Handle success request and send back data with status code 200/201
 *
 * @param {Response} res
 * @param {number} status
 * @param [any] data
 */
export const successHandler = (res: Response, status: number, data?: any) => {
  const response = {
    status: status || httpStatus.OK,
    message: httpStatus[`${status}_MESSAGE`],
    data,
  };

  res.status(status);
  res.json(response);
};

/**
 *  Handle fail request and send back data with status code 500
 *
 * @param {any} err
 * @param {Response} res
 */
export const errorHandler = (err: any, res: Response) => {
  let errorMessages = err.message;
  if (err instanceof ValidationError) {
    errorMessages = err.details.body?.map((error) => error.message) || err.details.query?.map((error) => error.message);
  }

  const response = {
    code: err.status || err.statusCode || 500,
    message: errorMessages || err.message || err.text || httpStatus[err.status || err.statusCode],
    errors: err.message,
    stack: err.stack,
  };

  res.status(err.status || err.statusCode || 500);
  res.json(response);
};

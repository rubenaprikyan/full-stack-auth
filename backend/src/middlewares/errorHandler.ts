import express from 'express';
import { BaseError } from '../modules/exceptions';

export const errorHandler = async (
  err: Error,
  req: express.Request,
  res: express.Response,
  next,
) => {
  await next();
  console.error(`Error: ${err instanceof BaseError}`); // TODO add proper logging
  /* TODO detect error types here and send corresponding errors
   instead of only internal server error */
  if (err instanceof BaseError) {
    const error = err.getError();
    return res.status(error.statusCode).json({
      error,
    });
  }
  return res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;

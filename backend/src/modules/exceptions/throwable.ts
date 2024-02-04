/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

type HandlerCallback<T, P> = (req: T, res: P, next?: NextFunction) => any;

/**
 * throwable
 * express middleware enhancer
 * catches thrown exceptions inside the callback
 *    and sends to express general error handler
 * @param callback
 */
function throwable<TReq extends Request = Request, TRes extends Response = Response>(
  callback: HandlerCallback<TReq, TRes>,
): HandlerCallback<TReq, TRes> {
  return async (req, res, next) => {
    try {
      return await callback(req, res, next);
    } catch (exception) {
      next(exception);
    }
  };
}

export default throwable;

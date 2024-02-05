/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { RequestWithFiles } from '../file-upload';

type HandlerCallbackWithCtx<T, P> = (ctx: { req: T; res: P }, next?: NextFunction) => any;
type ExpressMiddleware<T, P> = (req: T, res: P, next?: NextFunction) => any;

/**
 * Context with files
 */
export type Context = {
  req: RequestWithFiles;
  res: Response;
};

/**
 * throwable
 * express middleware enhancer
 * catches thrown exceptions inside the callback
 *    and sends to express general error handler
 * If your handler passes through throwable, it receives a single argument context | ctx
 *    which just wraps req, res into single object, so you use, ctx.req, ctx.res
 * @param {HandlerCallbackWithCtx} callback
 * @returns {ExpressMiddleware}
 */
function throwable<TReq extends Request = Request, TRes extends Response = Response>(
  callback: HandlerCallbackWithCtx<TReq, TRes>,
): ExpressMiddleware<TReq, TRes> {
  return async (req, res, next) => {
    try {
      return await callback({ req, res }, next);
    } catch (exception) {
      next(exception);
    }
  };
}

export default throwable;

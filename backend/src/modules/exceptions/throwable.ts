/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

type HandlerCallbackWithCtx<T, P> = (
  ctx: { req: T; res: P },
  next?: NextFunction,
) => Promise<{ statusCode: number; view: any }>;
type ExpressMiddleware<T, P> = (req: T, res: P, next?: NextFunction) => any;

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
  return (req, res, next) => {
    callback({ req, res }, next)
      .then(result => {
        res.status(result.statusCode).json(result.view);
      })
      .catch(exception => {
        console.error(exception);
        next(exception);
      });
  };
}

export default throwable;

import middleware from './middleware';
import { type Options } from './types';

export * from './types';

/**
 * buildMiddleware function to accept options and build expressjs middleware
 * @param options
 */
function buildMiddleware(options: Options) {
  return (req, res, next) => {
    middleware(req, res, next, options);
  };
}

export default buildMiddleware;

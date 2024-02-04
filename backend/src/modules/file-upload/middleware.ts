import { Request, Response, NextFunction } from 'express';
import busboy from 'busboy';
import FileUploader from './FileUploader';

import { createOptions, invariant } from './utils';
import { Options, RequestWithFiles } from './types';

function middleware(
  req: Request,
  res: Response,
  next: NextFunction,
  options: Options,
): void {
  const opts: Options = createOptions(options);

  if (req.headers['content-type'].includes('multipart/form-data')) {
    const reqWithFiles = req as RequestWithFiles;
    const uploader = new FileUploader({ req: reqWithFiles, res, next }, opts);

    const bb = busboy({ headers: req.headers });
    const fileEventHandler = (name, fileStream, info): void => {
      const part = { name, fileStream, info };
      uploader.addPart(part);
    };

    bb.on('file', fileEventHandler);
    bb.on('filesLimit', info => {
      uploader.abortRequestWithError('FILES_COUNT_LIMIT', info);
    });

    bb.on('close', () => {
      invariant('Done parsing form!');
      uploader.release();
      req.unpipe(bb);
      next();
    });

    req.pipe(bb);
  }
}

export default middleware;

import { Request, Response, NextFunction } from 'express';
import busboy from 'busboy';
import FileUploader from './FileUploader';

import { createOptions, invariant } from './utils';
import { Options, RequestWithFiles } from './types';
import { ERROR_DETAILS } from './errors';

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

    const bb = busboy({
      headers: req.headers,
      limits: {
        files: options.maxFilesCount,
        fileSize: options.maxFileSize,
      },
    });
    const fileEventHandler = (name, fileStream, info): void => {
      const part = { name, fileStream, info };
      uploader.addPart(part);
    };

    // Single file part reader
    bb.on('file', fileEventHandler);

    // Handling files count limit
    bb.on('filesLimit', info => {
      uploader.abortRequestWithError(
        ERROR_DETAILS.FILES_COUNT_LIMIT_ERROR.debug,
        `Allowed max ${opts.maxFilesCount} files.`,
        info,
      );
    });

    // Handling close multipart/form-data stream
    bb.on('close', () => {
      invariant('Done parsing form!');
      uploader.release();

      // unpiping the stream for garbage collection
      req.unpipe(bb);
      next();
    });

    req.pipe(bb);
  }
}

export default middleware;

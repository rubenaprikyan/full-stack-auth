import express from 'express';
import { BadRequest, BaseError, InternalServerError } from '../modules/exceptions';
import { ERROR_DETAILS, FileUploadException } from '../modules/file-upload';
import { UnsupportedMediaType } from '../modules/exceptions/UnsupportedMediaType';

function normalizeError(err): BaseError {
  // if its already normalized error, just return
  if (err instanceof BaseError) {
    return err;
  }

  // Normalize file-uploader exceptions
  if (err instanceof FileUploadException) {
    // send 400 error in some cases
    if (
      [
        ERROR_DETAILS.FILES_COUNT_LIMIT_ERROR.debug,
        ERROR_DETAILS.FILE_SIZE_LIMIT_EXCEEDED_ERROR.debug,
        ERROR_DETAILS.STREAM_READ_ERROR.debug,
      ].includes(err.debug)
    ) {
      return new BadRequest({
        message: err.message,
        originalErrorDetails: err.details,
      });
    }

    // send 415 error in the case of having UNSUPPORTED_MEDIA_TYPE_ERROR
    if (err.debug === ERROR_DETAILS.UNSUPPORTED_MEDIA_TYPE_ERROR.debug) {
      return new UnsupportedMediaType({
        message: err.message,
        originalErrorDetails: err.details,
      });
    }
  }

  return new InternalServerError('Server crashed internally for unknown reason');
}

export const errorHandler = async (
  err: Error,
  req: express.Request,
  res: express.Response,
  next,
) => {
  console.error(err); // TODO add proper logging
  next();
  // normalize errors, always it will be instanceof BaseError
  const error = normalizeError(err).getError();

  res.status(error.statusCode).json({
    error,
  });
};

export default errorHandler;

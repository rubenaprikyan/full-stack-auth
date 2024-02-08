export const ERROR_DETAILS = {
  FILE_SIZE_LIMIT_EXCEEDED_ERROR: {
    debug: 'FILE_SIZE_LIMIT_EXCEEDED_ERROR',
    message: 'File Size limit exceeded.',
  },

  FILES_COUNT_LIMIT_ERROR: {
    debug: 'FILES_COUNT_LIMIT_ERROR',
    message: 'Maximum files count exceeded.',
  },
  UNSUPPORTED_MEDIA_TYPE_ERROR: {
    debug: 'UNSUPPORTED_MEDIA_TYPE_ERROR',
    message: 'Unsupported media type.',
  },
  STREAM_READ_ERROR: {
    debug: 'STREAM_READ_ERROR',
    message: "Can't read stream.",
  },
};

/**
 * Special exception which is possible to identify as file-upload module exception
 * class FileUploadException
 */
export class FileUploadException extends Error {
  constructor(
    public debug: string,
    public message: string,
    public details: unknown,
  ) {
    super();
    Object.setPrototypeOf(this, FileUploadException.prototype);
  }
}

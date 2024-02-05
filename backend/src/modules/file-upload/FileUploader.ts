import { NextFunction, Response } from 'express';
import { FileInfo } from 'busboy';
import { v4 as uuidv4 } from 'uuid';
import concat from 'concat-stream';

import { File, Options, RequestWithFiles } from './types';
import { invariant } from './utils';
import { FileUploadException, ERROR_DETAILS } from './errors';

type Context = {
  req: RequestWithFiles;
  res: Response;
  next: NextFunction;
};

export type Part = {
  name: string;
  // eslint-disable-next-line no-undef
  fileStream: NodeJS.ReadableStream;
  info: FileInfo;
  data?: Buffer;
};

/**
 * class FileUploader
 * Handling multiple streams as parts, creates transform objects.
 * Handling errors, and send to express error handler
 */
class FileUploader {
  private files: File[] = [];

  /**
   * the weak map which is used to identify each part by its object reference
   * as a unique object selected FileInfo from the part,
   * @private parts
   */
  private parts: WeakMap<FileInfo, { buffer: Buffer }> = new Map();

  constructor(
    private ctx: Context,
    private options: Options,
  ) {}

  public addPart(part: Part) {
    // Check if mimeType is allowed and raise an error if not
    if (!this.options.allowedMediaTypes.includes(part.info.mimeType)) {
      return this.abortRequestWithError(
        ERROR_DETAILS.UNSUPPORTED_MEDIA_TYPE_ERROR.debug,
        {
          reason: `Media type ${part.info.mimeType} is not allowed.`,
          allowedMediaTypes: this.options.allowedMediaTypes,
        },
      );
    }

    invariant('ADD PART ==> ', part.info);
    this.registerListeners(part);
    this.parts.set(part.info, {
      buffer: null,
    });
  }

  /**
   * Adds listeners for stream handling to the multipart/form data's part
   * @param {Part} part
   * @private
   */
  private registerListeners(part: Part) {
    // Handling errors from stream
    part.fileStream.on('error', (err: Error) => {
      this.handleFileStreamError(err, part);
    });

    /**
     * Piped the stream into the stream-concat,
     * which checks buffer type does the right concat action.
     *
     * pipe -> sends chunks to the concat function every time,
     *      and concat function does data += chunk internally
     *      then if the stream ended it calls the callback with piped data
     *      used this library because it checks data types, for example if its array,
     *      it does TypedArray concat.
     *      If it's string or number, it just collects the sum
     */
    part.fileStream.pipe(
      concat({ encoding: 'buffer' }, data => {
        this.setPipedDataFromStream(part, data);
      }),
    );

    // Handling stream close action, to create transform object attach the req.files
    part.fileStream.on('close', () => this.finishPartStream(part));

    // Handling options limits exceeded cases caught by busboy
    part.fileStream.on('limit', inf => {
      this.abortRequestWithError(ERROR_DETAILS.FILE_SIZE_LIMIT_EXCEEDED_ERROR.debug, inf);
    });
  }

  /**
   * Store stream piped on the actual part
   * @param {Part} part
   * @param {Buffer} data
   * @private
   */
  private setPipedDataFromStream(part: Part, data: Buffer): void {
    const currentPart = this.parts.get(part.info);

    currentPart.buffer = data;

    invariant('New chunk arrived ====> ', typeof data);
  }

  /**
   * Utility function to do extra exceptions check
   * or cleanups when closing the stream of the part
   * @param {Part} part
   */
  public closeFileStream(part: Part) {
    // [...] check extra exceptions
    invariant('Done parsing form! ====> ', part);
  }

  /**
   * finishPartStream
   * creates transform objects from part to attach on req -> files later
   * @param part
   * @private
   */
  private finishPartStream(part: Part) {
    invariant('CURRENT PART ON CLOSE', part);
    const currentPart = this.parts.get(part.info);
    const file: File = {
      name: part.name,
      binary: currentPart.buffer,
      size: currentPart.buffer.length,
      mime: part.info.mimeType,
      filename: part.info.filename,
      ext: part.info.mimeType.split('/')[1],
      id: uuidv4(),
    };

    this.files.push(file);
  }

  /**
   * handle current part stream error
   * @param err
   * @param part
   */
  public handleFileStreamError(err: Error, part: Part): void {
    // raise can't read stream error, figure out reason as much as possible
    const exception = new FileUploadException(ERROR_DETAILS.STREAM_READ_ERROR.debug, err);
    invariant('ERROR :: ', err, part);
    this.ctx.next(exception);
  }

  /**
   * Release generated normalized files
   */
  public release(): void {
    // do some clean-ups
    this.ctx.req.files = this.files;
  }

  /**
   * abortRequestWithError
   * this function sends the FileUploadException error to the express error handler
   * @param debug
   * @param details
   */
  public abortRequestWithError(debug: string, details: Record<string, unknown>) {
    const error = new FileUploadException(debug, details);

    /* TODO check the reason and unpipe or resume other streams
     * i.e. do clean ups, and do garbage collection here
     */
    this.ctx.next(error);
  }
}

export default FileUploader;

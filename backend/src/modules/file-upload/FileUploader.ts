import { NextFunction, Response } from 'express';
import { FileInfo } from 'busboy';
import { v4 as uuidv4 } from 'uuid';
import concat from 'concat-stream';

import { File, Options, RequestWithFiles } from './types';
import { invariant } from './utils';

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

const errorCodes = {
  FILES_COUNT_LIMIT: {
    code: 400,
    message: 'Maximum files count',
  },
  FILE_SIZE_LIMIT: {
    code: 400,
    message: 'File size exceeded',
  },
  UNSUPPORTED_MIME_TYPE: {
    code: 419,
    message: 'Unsupported mimetype',
  },
};

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
    invariant('ADD PART ==> ', part.info);
    this.registerListeners(part);
    this.parts.set(part.info, {
      buffer: null,
    });
  }

  private registerListeners(part: Part) {
    part.fileStream.on('error', (err: Error) => {
      this.handleFileStreamError(err, part);
    });
    part.fileStream.pipe(
      concat({ encoding: 'buffer' }, data => {
        this.setPipedDataFromStream(part, data);
      }),
    );

    part.fileStream.on('close', () => this.finishPartStream(part));
    part.fileStream.on('limit', inf => {
      this.abortRequestWithError('FILE_SIZE_LIMIT', inf);
    });
  }

  private setPipedDataFromStream(part: Part, data: Buffer): void {
    const currentPart = this.parts.get(part.info);

    currentPart.buffer = data;

    invariant('New chunk arrived ====> ', typeof data);
  }

  public closeFileStream(part: Part) {
    // [...] check extra exceptions
    invariant('Done parsing form! ====> ', part);
  }

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
    // TODO raise can't read stream error, figure out reason as much as possible
    invariant('ERROR :: ', err, part);
  }

  /**
   * Release generated normalized files
   */
  public release(): void {
    // do some clean-ups
    this.ctx.req.files = this.files;
  }

  public abortRequestWithError(code: string, info) {
    const error = errorCodes[code];

    this.ctx.res.status(error.code).send({
      message: error.message,
      details: { info },
    });
  }
}

export default FileUploader;

import { Request } from 'express';

export type FileTypes = Array<string>;

export type File = {
  /**
   * File extension
   */
  ext: string;
  /**
   * file mime type
   */
  mime: string;
  /**
   * Field name
   */
  name: string;
  /**
   * file data
   */
  binary: Buffer;
  /**
   * file name
   */
  filename: string;
  /**
   * file size in bytes
   */
  size: number;
  /**
   * unique identifier - typically it will be UUID
   */
  id: string;
};

export type Options = {
  /**
   * size of the file in BYTES
   */
  maxFileSize?: number;
  /**
   * files count
   */
  maxFilesCount?: number;
  /**
   * allowed media types
   * ex. ['image/jpeg']
   */
  allowedMediaTypes?: FileTypes;
};

/**
 * Express request with attached file property
 */
export interface RequestWithFiles extends Request {
  fileOpts: Options;
  files: File[];
}

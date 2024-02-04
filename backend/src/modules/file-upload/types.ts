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
  fileSize?: number;
  /**
   * files count
   */
  fileCount?: number;
  /**
   * allowed types
   * ex. ['image/jpeg']
   */
  allowedTypes?: FileTypes;
};

/**
 * Express request with attached file property
 */
export interface RequestWithFiles extends Request {
  fileOpts: Options;
  files: File[];
}

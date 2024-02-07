import { ViewModel } from '@/rtk-api/models/ViewModel';

/**
 * ================ Files Upload Mutation ==============
 */

export type FilesUploadQueryBody = FormData;

export type FileUploadResponse = {
  name: string;
  key: string;
  size: number;
  mimeType: string;
  location: string;
  // etc.
};

export type FileUploadViewModel = ViewModel<FileUploadResponse[]>;

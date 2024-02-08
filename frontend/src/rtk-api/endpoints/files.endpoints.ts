import api from '@/rtk-api/rtkBase';
import { transformErrorResponse } from '../transformers/generalErrorResponseTransformer';

import {
  FilesUploadQueryBody,
  FileUploadViewModel,
} from '../models/files.models';

const filesApi = api.enhanceEndpoints({}).injectEndpoints({
  endpoints: (build) => ({
    /**
     * Upload endpoint handler
     */
    upload: build.mutation<FileUploadViewModel, FilesUploadQueryBody>({
      query: (body: FormData) => ({
        url: '/files/upload',
        method: 'POST',
        formData: true,
        body,
      }),
      transformErrorResponse,
    }),
  }),
});

export const { useUploadMutation } = filesApi;

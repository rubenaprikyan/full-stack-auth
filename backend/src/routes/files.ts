import express from 'express';

import FilesController from '../controllers/FilesController';
import fileUpload from '../modules/file-upload';
import throwable from '../modules/exceptions/throwable';
import { Context } from '../types';

const RESOURCE_NAME = '/files';
const router = express.Router();

const fileController = new FilesController();

const uploadConfig = {
  maxFilesCount: 25,
  maxFileSize: 1024 * 1024, // 1mb
  allowedMediaTypes: ['image/jpeg'],
};

const upload = fileUpload(uploadConfig);

router.post(
  '/upload',
  upload,
  throwable(async (ctx: Context) => {
    const result = await fileController.upload(ctx.req.files);
    return {
      statusCode: 200,
      view: { data: result },
    };
  }),
);

router.get(
  '/upload/configuration',
  throwable(async () => {
    return {
      view: {
        data: {
          options: uploadConfig,
        },
      },
      statusCode: 200,
    };
  }),
);

export default {
  RESOURCE_NAME,
  router,
};

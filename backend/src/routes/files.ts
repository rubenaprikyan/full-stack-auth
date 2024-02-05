import express from 'express';

import FilesController from '../controllers/FilesController';
import fileUpload from '../modules/file-upload';
import throwable, { Context } from '../modules/exceptions/throwable';

const RESOURCE_NAME = '/files';
const router = express.Router();

const fileController = new FilesController();

const upload = fileUpload({
  maxFilesCount: 25,
  maxFileSize: 1024 * 1024, // 1mb
  allowedMediaTypes: ['image/jpeg'],
});

router.post(
  '/upload',
  upload,
  throwable(async (ctx: Context) => {
    const result = await fileController.upload(ctx.req.files);
    ctx.res.status(200).json({ data: result });
  }),
);

router.get('/upload-options', (req, res) => {
  res.status(200).json({
    data: {
      options: upload,
    },
  });
});

export default {
  RESOURCE_NAME,
  router,
};

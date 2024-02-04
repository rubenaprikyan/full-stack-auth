import express, { Response } from 'express';

import FilesController from '../controllers/FilesController';
import fileUpload, { RequestWithFiles } from '../modules/file-upload';
import throwable from '../modules/exceptions/throwable';

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
  throwable(async (req: RequestWithFiles, res: Response) => {
    const result = await fileController.upload(req.files);
    res.status(200).json({ data: result });
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

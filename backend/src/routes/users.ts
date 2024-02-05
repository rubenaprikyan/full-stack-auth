import express from 'express';
import UserController from '../controllers/UserController';
import CustomDataSource from '../database/data-source';
import throwable, { Context } from '../modules/exceptions/throwable';

import { dbConfig } from '../config';

/**
 * RESOURCE_NAME used as the rest api principle
 */
const RESOURCE_NAME = '/users';
const router = express.Router();

const AppDataSource = CustomDataSource.getInstance(dbConfig);
const userController = new UserController(AppDataSource);

router.post(
  '/register',
  throwable(async (ctx: Context) => {
    const view = await userController.register(ctx);

    return {
      view,
      statusCode: 200,
    };
  }),
);

export default {
  RESOURCE_NAME,
  router,
};

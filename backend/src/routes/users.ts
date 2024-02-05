import express from 'express';
import UserController from '../controllers/UserController';
import CustomDataSource from '../database/data-source';
import throwable from '../modules/exceptions/throwable';

import { dbConfig } from '../config';
import auth from '../middlewares/auth';
import { Context } from '../types';

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
      statusCode: 201,
    };
  }),
);

router.post(
  '/login',
  throwable(async (ctx: Context) => {
    const view = await userController.login(ctx);
    return {
      view,
      statusCode: 200,
    };
  }),
);

router.delete(
  '/logout',
  auth,
  throwable(async (ctx: Context) => {
    const view = await userController.logout(ctx);
    return {
      view,
      statusCode: 204,
    };
  }),
);

export default {
  RESOURCE_NAME,
  router,
};

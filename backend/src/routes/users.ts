import express from 'express';
import UserController from '../controllers/UserController';
import CustomDataSource from '../database/data-source';
import throwable from '../modules/exceptions/throwable';

import { dbConfig } from '../config';

/**
 * RESOURCE_NAME used as the rest api principle
 */
const RESOURCE_NAME = '/users';
const router = express.Router();

const AppDataSource = CustomDataSource.getInstance(dbConfig);
const userController = new UserController(AppDataSource);

router.post('/register', throwable(userController.register));

export default {
  RESOURCE_NAME,
  router,
};

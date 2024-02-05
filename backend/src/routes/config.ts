import { Router } from 'express';
import files from './files';
import users from './users';

const routes: Record<string, Router> = {
  [users.RESOURCE_NAME]: users.router,
  [files.RESOURCE_NAME]: files.router,
};

export default routes;

import express from 'express';
import routerConfig from './config';

function registerRoutes(app: express.Express) {
  for (const resource_name in routerConfig) {
    app.use(`/api${resource_name}`, routerConfig[resource_name]);
  }
}

export default registerRoutes;

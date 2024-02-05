import express from 'express';

import CustomDataSource from './database/data-source';
import errorHandler from './middlewares/errorHandler';

import { dbConfig, serverConfig } from './config';
import fileUpload, { RequestWithFiles } from './modules/file-upload';
import registerRoutes from './routes';

const app = express();
const AppDataSource = CustomDataSource.getInstance(dbConfig);

/**
 * Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */
registerRoutes(app);

app.get('/ping', (req, res) => {
  res.status(200).json({ data: 'pong' });
});

/**
 * Error handler
 */
app.use(errorHandler);

const uploader = fileUpload();
app.post('/files/upload', uploader, (req: RequestWithFiles, res) => {
  console.log(req.files);
  res.status(200).json({});
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(serverConfig.port, () => {
      console.log(`Server listens port ${serverConfig.port}`);
    });
    console.log('Data Source has been initialized!');
  })
  .catch((error: Error) => console.log(error));

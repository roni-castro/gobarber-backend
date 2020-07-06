import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import '../typeorm';
import '@shared/container';
import globalErrorMiddleware from './middlewares/global-error.middleware';
import { errors } from 'celebrate';

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

app.use(errors());
app.use(globalErrorMiddleware);

app.listen(3333, () => {
  console.log('Started server on port 3333');
});

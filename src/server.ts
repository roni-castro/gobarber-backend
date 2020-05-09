import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import routes from './data';
import './data/database';

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(3333, () => {
  console.log('Started server on port 3333');
});

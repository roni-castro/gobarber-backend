import 'reflect-metadata';
import express from 'express';
import routes from './data/appointments';
import './data/database';

const app = express();
app.use(express.json());
app.use(routes);

app.listen(3333, () => {
  console.log('Started server on port 3333');
});

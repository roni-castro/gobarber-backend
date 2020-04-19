import express from 'express';
import routes from './data/appointments';

const app = express();
app.use(express.json());
app.use(routes);

app.listen(3333, () => {
  console.log('Started server on port 3333');
});

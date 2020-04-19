import express from 'express';

const app = express();

app.get('/', (request, response) => {
  return response.json({ message: 'hello' });
});

app.listen(3000, () => {
  console.log('Started server on port 3000');
});

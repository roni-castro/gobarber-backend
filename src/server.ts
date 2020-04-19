import express from 'express';

const app = express();

app.get('/', (request, response) => response.json({ message: 'Hello' }));

app.listen(3000, () => {
  console.log('Started server on port 3000');
});

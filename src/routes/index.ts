import { Router } from 'express';

const routes = Router();

routes.get('/', (request, response) => {
  const { name } = request.body;
  return response.json({ message: `Hello ${name}` });
});

export default routes;

import { Router } from 'express';

const appointmentsRouter = Router();

appointmentsRouter.post('/', (request, response) => {
  const { name } = request.body;
  return response.json({ message: `Hello ${name}` });
});

export default appointmentsRouter;

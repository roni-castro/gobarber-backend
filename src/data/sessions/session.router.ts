import { Router } from 'express';
import CreateSessionUseCase from '../../domain/session/create-session.usecase';

const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;
    const sessionUseCase = new CreateSessionUseCase();
    const sessionResponse = await sessionUseCase.execute({ email, password });
    return response.json(sessionResponse);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default sessionRouter;

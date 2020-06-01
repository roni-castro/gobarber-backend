import { Router } from 'express';
import CreateSessionUseCase from '@modules/session/create-session.usecase';

const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;
    const sessionUseCase = new CreateSessionUseCase();
    const { user, token } = await sessionUseCase.execute({
      email,
      password,
    });
    return response.json({ user, token });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default sessionRouter;

import { Router } from 'express';
import CreateUserUseCase from '../../domain/users/create-user.usecase';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const useCase = new CreateUserUseCase();
    const user = await useCase.execute({ name, email, password });
    return response.json(user);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default usersRouter;

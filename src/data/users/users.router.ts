import { Router } from 'express';
import CreateUserUseCase from '../../domain/users/create-user.usecase';
import FindUsersUseCase from '../../domain/users/find-users.usecase';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  const useCase = new FindUsersUseCase();
  const users = await useCase.execute();
  return response.json(users);
});

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

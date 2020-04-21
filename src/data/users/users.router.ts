import { Router } from 'express';
import CreateUserUseCase from '../../domain/users/create-user.usecase';
import FindUsersUseCase from '../../domain/users/find-users.usecase';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  const useCase = new FindUsersUseCase();
  let users = await useCase.execute();
  users = users.map(user => {
    // eslint-disable-next-line no-param-reassign
    delete user.password;
    return user;
  });
  return response.json(users);
});

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const useCase = new CreateUserUseCase();
    const user = await useCase.execute({ name, email, password });
    delete user.password;
    return response.json(user);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default usersRouter;

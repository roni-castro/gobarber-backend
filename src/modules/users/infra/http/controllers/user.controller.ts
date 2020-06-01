import { container } from 'tsyringe';
import { Request, Response } from 'express';

import CreateUserUseCase from '@modules/users/services/create-user.usecase';
import FindUsersUseCase from '@modules/users/services/find-users.usecase';

export default class UserController {
  public async create(request: Request, response: Response) {
    const useCase = container.resolve(CreateUserUseCase);
    const { name, email, password } = request.body;
    const user = await useCase.execute({ name, email, password });
    delete user.password;
    return response.json(user);
  }

  public async show(request: Request, response: Response) {
    const useCase = container.resolve(FindUsersUseCase);
    let users = await useCase.execute();
    users = users.map(user => {
      // eslint-disable-next-line no-param-reassign
      delete user.password;
      return user;
    });
    return response.json(users);
  }
}

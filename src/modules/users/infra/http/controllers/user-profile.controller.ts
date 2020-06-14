import { container } from 'tsyringe';
import { Request, Response } from 'express';

import UpdateUserProfileUseCase from '@modules/users/services/update-user-profile.usecase';
import FindUserUseCase from '@modules/users/services/find-user.usecase';
import AppError from '@shared/error/AppError';

export default class UserProfileController {
  public async show(request: Request, response: Response) {
    const useCase = container.resolve(FindUserUseCase);
    let user = await useCase.execute({ id: request.user.id });
    delete user.password;
    return response.json(user);
  }

  public async update(request: Request, response: Response) {
    const {
      name,
      email,
      oldPassword,
      password,
      passwordConfirmation,
    } = request.body;
    const useCase = container.resolve(UpdateUserProfileUseCase);
    let user = await useCase.execute({
      id: request.user.id,
      name,
      email,
      oldPassword,
      password,
      passwordConfirmation,
    });
    delete user.password;
    return response.json(user);
  }
}

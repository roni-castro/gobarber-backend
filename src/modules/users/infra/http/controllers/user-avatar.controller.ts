import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer'
import UpdateUserAvatarUseCase from '@modules/users/services/update-user-avatar.usecase';

export default class UserAvatarController {
  public async update(request: Request, response: Response) {
    const useCase = container.resolve(UpdateUserAvatarUseCase);
    const user = await useCase.execute({
      avatarFilename: request.file.filename,
      user_id: request.user.id,
    });
    return response.json(classToClass(user));
  }
}

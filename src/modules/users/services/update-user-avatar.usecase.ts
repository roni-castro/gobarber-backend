import fs from 'fs';
import path from 'path';
import User from '../infra/typeorm/entities/user.entity';
import uploadConfig from '@shared/infra/http/routes/upload/upload-config';
import AppError from '@shared/error/AppError';
import IUserRepository from '../repositories/IUserRepository';

interface UpdateUserAvatarRequestDTO {
  user_id: string;
  avatarFilename: string;
}

export default class UpdateUserAvatarUseCase {
  constructor(private repository: IUserRepository) {}

  async execute({
    user_id,
    avatarFilename,
  }: UpdateUserAvatarRequestDTO): Promise<User> {
    const user = await this.repository.findById(user_id);
    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      try {
        await fs.promises.stat(userAvatarFilePath);
        await fs.promises.unlink(userAvatarFilePath);
      } catch (error) {
        console.log(error);
      }
    }
    user.avatar = avatarFilename;
    await this.repository.save(user);
    return user;
  }
}

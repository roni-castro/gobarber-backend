import { getRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';
import User from '../../data/database/entity/user.entity';
import uploadConfig from '../../data/upload/upload-config';
import AppError from '../../data/error/AppError';

interface UpdateUserAvatarRequestDTO {
  user_id: string;
  avatarFilename: string;
}

export default class UpdateUserAvatarUseCase {
  async execute({
    user_id,
    avatarFilename,
  }: UpdateUserAvatarRequestDTO): Promise<User> {
    const repository = getRepository(User);
    const user = await repository.findOne(user_id);
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
    await repository.save(user);
    return user;
  }
}

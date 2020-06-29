import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/user.entity';
import AppError from '@shared/error/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IStorageProvider from '@shared/container/providers/storageProvider/models/IStorageProvider';

interface UpdateUserAvatarRequestDTO {
  user_id: string;
  avatarFilename: string;
}

@injectable()
export default class UpdateUserAvatarUseCase {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute({
    user_id,
    avatarFilename,
  }: UpdateUserAvatarRequestDTO): Promise<User> {
    const user = await this.repository.findById(user_id);
    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }
    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }
    const fileUploaded = await this.storageProvider.saveFile(avatarFilename);
    user.avatar = fileUploaded;
    await this.repository.save(user);
    return user;
  }
}

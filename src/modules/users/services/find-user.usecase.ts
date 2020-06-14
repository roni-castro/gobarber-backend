import User from '../infra/typeorm/entities/user.entity';
import IUserRepository from '../repositories/IUserRepository';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/error/AppError';

interface IRequest {
  id: string;
}

@injectable()
export default class FindUserUseCase {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository
  ) {}

  async execute({ id }: IRequest): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}

import IUserRepository from '../../users/repositories/IUserRepository';
import { inject, injectable } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/user.entity';

@injectable()
export default class ListAllProvidersUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository
  ) {}

  async execute(exceptUserId: string): Promise<User[]> {
    return this.userRepository.findAllProviders({ exceptUserId });
  }
}

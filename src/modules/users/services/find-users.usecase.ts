import User from '../infra/typeorm/entities/user.entity';
import IUserRepository from '../repositories/IUserRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class FindUsersUseCase {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository
  ) {}

  execute(): Promise<User[]> {
    return this.repository.findAll();
  }
}

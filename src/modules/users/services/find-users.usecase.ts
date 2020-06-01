import User from '../infra/typeorm/entities/user.entity';
import IUserRepository from '../repositories/IUserRepository';

export default class FindUsersUseCase {
  constructor(private repository: IUserRepository) {}

  execute(): Promise<User[]> {
    return this.repository.findAll();
  }
}

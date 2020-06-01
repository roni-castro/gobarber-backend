import { getRepository } from 'typeorm';
import User from '../infra/typeorm/entities/user.entity';

export default class FindUsersUseCase {
  execute(): Promise<User[]> {
    const repository = getRepository(User);
    return repository.find();
  }
}

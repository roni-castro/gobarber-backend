import { getRepository } from 'typeorm';
import User from '../../data/database/entity/user.entity';

export default class FindUsersUseCase {
  execute(): Promise<User[]> {
    const repository = getRepository(User);
    return repository.find();
  }
}

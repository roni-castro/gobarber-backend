import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { Repository, getRepository, Not } from 'typeorm';
import User from '../entities/user.entity';
import IFindProvidersDTO from '@modules/users/repositories/dtos/findProvidersDTO';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;
  constructor() {
    this.ormRepository = getRepository(User);
  }

  async findByEmail(email: string) {
    return this.ormRepository.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.ormRepository.findOne(id);
  }

  async findAllProviders({ exceptUserId }: IFindProvidersDTO) {
    return this.ormRepository.find({
      where: { id: Not(exceptUserId) },
    });
  }

  async findAll() {
    return this.ormRepository.find();
  }

  async create(data: ICreateUserDTO) {
    const user: User = this.ormRepository.create(data);
    await this.ormRepository.save(user);
    return user;
  }

  async save(user: User) {
    return this.ormRepository.save(user);
  }
}

export default UserRepository;

import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { Repository, getRepository } from 'typeorm';
import User from '../entities/user.entity';

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

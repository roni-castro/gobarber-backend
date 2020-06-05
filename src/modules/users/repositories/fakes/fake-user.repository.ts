import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import User from '../../infra/typeorm/entities/user.entity';

class UserRepository implements IUserRepository {
  private users: User[];

  async findByEmail(email: string) {
    return this.users.find(user => user.email === email);
  }

  async findById(id: string) {
    return this.users.find(user => user.id === id);
  }

  async findAll() {
    return this.users;
  }

  async create({ name, email, password }: ICreateUserDTO) {
    const user: User = new User();
    Object.assign(user, { id: uuid(), email, name, password });
    await this.users.push(user);
    return user;
  }

  async save(user: User) {
    const foundIndex = this.users.findIndex(curUser => curUser.id === user.id);
    if (foundIndex >= 0) {
      this.users[foundIndex] = user;
    }
    return user;
  }
}

export default UserRepository;

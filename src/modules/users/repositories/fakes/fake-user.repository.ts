import { uuid } from 'uuidv4';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../../infra/typeorm/entities/user.entity';
import IFindProvidersDTO from '../dtos/findProvidersDTO';

class FakeUserRepository implements IUserRepository {
  private users: User[] = [];

  async findByEmail(email: string) {
    return this.users.find(user => user.email === email);
  }

  async findById(id: string) {
    return this.users.find(user => user.id === id);
  }

  async findAll() {
    return this.users;
  }

  async findAllProviders(params: IFindProvidersDTO) {
    return this.users.filter(user => user.id !== params.exceptUserId);
  }

  async create(data: ICreateUserDTO) {
    const user: User = new User();
    Object.assign(user, { id: uuid() }, data);
    this.users.push(user);
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

export default FakeUserRepository;

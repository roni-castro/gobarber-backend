import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/user.entity';
import IFindProvidersDTO from './dtos/findProvidersDTO';

export default interface IUserRepository {
  findAll(): Promise<User[]>;
  findAllProviders(params: IFindProvidersDTO): Promise<User[]>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}

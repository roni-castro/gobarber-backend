import User from '../infra/typeorm/entities/user.entity';
import AppError from '@shared/error/AppError';
import IUserRepository from '../repositories/IUserRepository';
import { injectable, inject } from 'tsyringe';
import IHashProvider from '../providers/hashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/cacheProvider/models/i-cache-provider';

interface CreateUserRequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
export default class CreateUserUseCase {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserRequestDTO): Promise<User> {
    const userFound = await this.repository.findByEmail(email);
    if (userFound) {
      throw new AppError('Email already used');
    }
    const hashedPassword = await this.hashProvider.generateHash(password);
    const user: User = await this.repository.create({
      name,
      email,
      password: hashedPassword,
    });
    await this.cacheProvider.invalidatePrefix('providers-list');
    return user;
  }
}

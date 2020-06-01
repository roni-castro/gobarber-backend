import { hash } from 'bcryptjs';
import User from '../infra/typeorm/entities/user.entity';
import AppError from '@shared/error/AppError';
import IUserRepository from '../repositories/IUserRepository';

interface CreateUserRequestDTO {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserUseCase {
  constructor(private repository: IUserRepository) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserRequestDTO): Promise<User> {
    const userFound = await this.repository.findByEmail(email);
    if (userFound) {
      throw new AppError('Email already used');
    }
    const hashedPassword = await hash(password, 8);
    const user: User = await this.repository.create({
      name,
      email,
      password: hashedPassword,
    });
    return user;
  }
}

import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../../data/database/entity/user.entity';
import AppError from '../../data/error/AppError';

interface CreateUserRequestDTO {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserUseCase {
  async execute({
    name,
    email,
    password,
  }: CreateUserRequestDTO): Promise<User> {
    const repository = getRepository(User);
    const userFound = await repository.findOne({ where: { email } });
    if (userFound) {
      throw new AppError('Email already used');
    }
    const hashedPassword = await hash(password, 8);
    const user: User = repository.create({
      name,
      email,
      password: hashedPassword,
    });
    await repository.save(user);
    return user;
  }
}

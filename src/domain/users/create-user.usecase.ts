import { getRepository } from 'typeorm';
import User from '../../data/database/entity/user.entity';

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
      throw new Error('Email already used');
    }
    const user: User = repository.create({
      name,
      email,
      password,
    });
    await repository.save(user);
    return user;
  }
}

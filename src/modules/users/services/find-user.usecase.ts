import User from '../infra/typeorm/entities/user.entity';
import IUserRepository from '../repositories/IUserRepository';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  id: string;
}

@injectable()
export default class FindUserUseCase {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository
  ) {}

  execute({ id }: IRequest): Promise<User | undefined> {
    return this.repository.findById(id);
  }
}

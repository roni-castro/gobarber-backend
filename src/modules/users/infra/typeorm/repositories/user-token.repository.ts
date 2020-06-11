import { getRepository, Repository } from 'typeorm';

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserToken from '../entities/user-token.entity';

export default class UserTokenRepository implements IUserTokenRepository {
  private ormRepository: Repository<UserToken>;
  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  async generate(userId: string) {
    return {} as UserToken;
  }
}

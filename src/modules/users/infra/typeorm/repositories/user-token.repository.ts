import { getRepository, Repository } from 'typeorm';

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserToken from '../entities/user-token.entity';

export default class UserTokenRepository implements IUserTokenRepository {
  private ormRepository: Repository<UserToken>;
  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  async findByToken(token: string) {
    return this.ormRepository.findOne({
      where: { token },
    });
  }

  async generate(userId: string) {
    const userToken = this.ormRepository.create({
      user_id: userId,
    });
    this.ormRepository.save(userToken);
    return userToken;
  }
}

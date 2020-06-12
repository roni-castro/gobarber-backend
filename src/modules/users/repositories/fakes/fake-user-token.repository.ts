import { uuid } from 'uuidv4';

import IUserTokenRepository from '../IUserTokenRepository';
import UserToken from '@modules/users/infra/typeorm/entities/user-token.entity';

export default class FakeUserTokenRepository implements IUserTokenRepository {
  private userTokens: UserToken[] = [];

  async generate(userId: string) {
    const userToken = new UserToken();
    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id: userId,
      created_at: new Date(),
    });
    this.userTokens.push(userToken);
    return userToken;
  }

  public async findByToken(token: string) {
    return this.userTokens.find(currToken => currToken.token === token);
  }
}

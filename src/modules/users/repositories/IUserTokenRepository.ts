import UserToken from '../infra/typeorm/entities/user-token.entity';

export default interface IUserTokenRepository {
  generate(userId: string): Promise<UserToken>;
}

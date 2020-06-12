import { injectable, inject } from 'tsyringe';
import { addHours, isAfter } from 'date-fns';
import IUserRepository from '../repositories/IUserRepository';
import AppError from '@shared/error/AppError';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import User from '../infra/typeorm/entities/user.entity';
import IHashProvider from '../providers/hashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

@injectable()
export default class ResetPasswordUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    token,
    oldPassword,
    password,
    confirmPassword,
  }: IRequest): Promise<User> {
    if (password !== confirmPassword) {
      throw new AppError('Passwords does not match');
    }

    const userToken = await this.userTokenRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('Invalid token', 401);
    }

    const maximumAllowedDate = addHours(userToken.created_at, 2);
    if (isAfter(Date.now(), maximumAllowedDate)) {
      throw new AppError('Token has expired');
    }

    const user = await this.userRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User not found');
    }

    const isOldPasswordValid = await this.hashProvider.compareHash(
      user.password,
      oldPassword
    );
    if (!isOldPasswordValid) {
      throw new AppError('Old password is not correct');
    }

    user.password = await this.hashProvider.generateHash(password);
    return this.userRepository.save(user);
  }
}

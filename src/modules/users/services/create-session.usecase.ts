import jwt from 'jsonwebtoken';

import AppError from '@shared/error/AppError';
import signingConfig from '@config/signing.constants';
import { CreateSessionResponseDTO } from '../dtos/create-session-response.dto';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '../providers/hashProvider/models/IHashProvider';

interface CreateSessionRequest {
  email: string;
  password: string;
}

@injectable()
export default class CreateSessionUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  async execute({
    email,
    password,
  }: CreateSessionRequest): Promise<CreateSessionResponseDTO> {
    const userFound = await this.userRepository.findByEmail(email);
    if (!userFound) {
      throw new AppError('Email or password does not match', 401);
    }
    const isPasswordValid = await this.hashProvider.compareHash(
      password,
      userFound.password
    );
    if (!isPasswordValid) {
      throw new AppError('Email or password does not match', 401);
    }
    const { secretKey, expiresIn } = signingConfig;
    const token = jwt.sign({ userId: userFound.id }, secretKey!, {
      subject: userFound.id,
      expiresIn,
    });
    return {
      token,
      user: userFound,
    };
  }
}

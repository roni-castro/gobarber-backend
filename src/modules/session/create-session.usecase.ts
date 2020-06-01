import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import AppError from '@shared/error/AppError';
import signingConfig from '@config/signing.constants';
import User from '../users/infra/typeorm/entities/user.entity';
import { CreateSessionResponseDTO } from './models/create-session-response.dto';

interface CreateSessionRequestDTO {
  email: string;
  password: string;
}

export default class CreateSessionUseCase {
  async execute({
    email,
    password,
  }: CreateSessionRequestDTO): Promise<CreateSessionResponseDTO> {
    const userRepository = getRepository(User);
    const userFound = await userRepository.findOne({ where: { email } });
    if (!userFound) {
      throw new AppError('Email or password does not match', 401);
    }
    const isPasswordValid = await compare(password, userFound.password);
    if (!isPasswordValid) {
      throw new AppError('Email or password does not match', 401);
    }
    const { secretKey, expiresIn } = signingConfig;
    const token = jwt.sign({ userId: userFound.id }, secretKey, {
      subject: userFound.id,
      expiresIn,
    });
    return {
      token,
      user: { id: userFound.id, email: userFound.email, name: userFound.name },
    };
  }
}

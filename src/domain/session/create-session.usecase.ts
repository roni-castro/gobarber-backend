import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { request } from 'express';
import User from '../../data/database/entity/user.entity';
import { CreateSessionResponseDTO } from '../models/session/create-session-response.dto';
import signingConfig from './signing.constants';

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
      throw new Error('Email or password does not match');
    }
    const isPasswordValid = await compare(password, userFound.password);
    if (!isPasswordValid) {
      throw new Error('Email or password does not match');
    }
    const { secretKey, expiresIn } = signingConfig;
    const token = jwt.sign({ userId: userFound.id }, secretKey, {
      expiresIn,
    });
    request.user = userFound;
    return {
      token,
      user: { id: userFound.id, email: userFound.email, name: userFound.name },
    };
  }
}

import { injectable, inject } from 'tsyringe';
import IUserRepository from '../repositories/IUserRepository';
import IEmailProvider from '@shared/container/providers/emailProvider/models/IEmailProvider';
import AppError from '@shared/error/AppError';

interface IRequest {
  email: string;
}

@injectable()
export default class SendForgotPasswordEmailUseCase {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
    private emailProvider: IEmailProvider
  ) {}

  public async execute({ email }: IRequest) {
    const userFound = await this.repository.findByEmail(email);
    if (!userFound) {
      throw new AppError('User does not exists') ;
    }
    return this.emailProvider.sendEmail(email, 'Pedido enviado');
  }
}

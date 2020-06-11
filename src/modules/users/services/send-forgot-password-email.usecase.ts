import { injectable, inject } from 'tsyringe';
import IUserRepository from '../repositories/IUserRepository';
import IEmailProvider from '@shared/container/providers/emailProvider/models/IEmailProvider';
import AppError from '@shared/error/AppError';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface IRequest {
  email: string;
}

@injectable()
export default class SendForgotPasswordEmailUseCase {
  constructor(
    @inject('UserRepository')
    private repository: IUserRepository,
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
    @inject('EmailProvider')
    private emailProvider: IEmailProvider
  ) {}

  public async execute({ email }: IRequest) {
    const userFound = await this.repository.findByEmail(email);
    if (!userFound) {
      throw new AppError('User does not exists');
    }
    const userToken = await this.userTokenRepository.generate(userFound.id);
    return this.emailProvider.sendEmail(email, 'Pedido enviado');
  }
}

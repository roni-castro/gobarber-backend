import { container } from 'tsyringe';
import { Request, Response } from 'express';

import SendForgotPasswordEmailUseCase from '@modules/users/services/send-forgot-password-email.usecase';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response) {
    const useCase = container.resolve(SendForgotPasswordEmailUseCase);
    const { email } = request.body;
    await useCase.execute({ email });
    return response.status(204).json();
  }
}

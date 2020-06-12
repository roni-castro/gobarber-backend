import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ResetPasswordUseCase from '@modules/users/services/reset-password.usecase';

export default class ResetPasswordController {
  public async create(request: Request, response: Response) {
    const useCase = container.resolve(ResetPasswordUseCase);
    const { token, password, confirmPassword } = request.body;
    await useCase.execute({ token, password, confirmPassword });
    return response.status(204).json();
  }
}

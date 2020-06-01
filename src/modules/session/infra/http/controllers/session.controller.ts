import { Request, Response } from 'express';
import CreateSessionUseCase from '@modules/session/create-session.usecase';
import { container } from 'tsyringe';

export default class SessionController {
  public async create(request: Request, response: Response) {
    try {
      const sessionUseCase = container.resolve(CreateSessionUseCase);
      const { email, password } = request.body;
      const { user, token } = await sessionUseCase.execute({
        email,
        password,
      });
      return response.json({ user, token });
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import ListAllProvidersUseCase from '@modules/appointments/services/list-all-providers.usecase';

export default class ProvidersController {
  public async index(request: Request, response: Response) {
    const listAllProvidersUseCase = container.resolve(ListAllProvidersUseCase);
    const userId = request.user.id;
    const providers = await listAllProvidersUseCase.execute(userId);
    return response.json(classToClass(providers));
  }
}

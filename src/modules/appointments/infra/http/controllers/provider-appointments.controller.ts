import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAppointmentsUseCase from '@modules/appointments/services/list-provider-appointments.usecase';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response) {
    const listProviderAppointmentsUseCase = container.resolve(
      ListProviderAppointmentsUseCase
    );
    const { day, month, year } = request.body;
    const providerId = request.user.id;
    const appointments = await listProviderAppointmentsUseCase.execute({
      providerId,
      day,
      month,
      year,
    });
    return response.json(appointments);
  }
}

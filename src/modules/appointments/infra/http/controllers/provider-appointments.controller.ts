import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderAppointmentsUseCase from '@modules/appointments/services/list-provider-appointments.usecase';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response) {
    const listProviderAppointmentsUseCase = container.resolve(
      ListProviderAppointmentsUseCase
    );
    const { day, month, year } = request.query;
    const providerId = request.user.id;
    const appointments = await listProviderAppointmentsUseCase.execute({
      providerId,
      day: +day,
      month: +month,
      year: +year,
    });
    return response.json(classToClass(appointments));
  }
}

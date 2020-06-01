import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentUseCase from '@modules/appointments/services/create-appointment.usecase';
import FindAppointmentUseCase from '@modules/appointments/services/find-appointment.usecase';

export default class AppointmentController {
  public async create(request: Request, response: Response) {
    try {
      const createAppointmentUseCase = container.resolve(
        CreateAppointmentUseCase
      );
      const { provider_id, date } = request.body;
      const appointment = await createAppointmentUseCase.execute({
        date: parseISO(date),
        provider_id,
      });
      return response.json(appointment);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }

  public async show(request: Request, response: Response) {
    const findAppointmentUseCase = container.resolve(FindAppointmentUseCase);
    const appointments = await findAppointmentUseCase.execute();
    response.json(appointments);
  }
}

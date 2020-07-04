import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateAppointmentUseCase from '@modules/appointments/services/create-appointment.usecase';
import FindAppointmentUseCase from '@modules/appointments/services/find-appointment.usecase';
import { classToClass } from 'class-transformer';

export default class AppointmentController {
  public async create(request: Request, response: Response) {
    try {
      const createAppointmentUseCase = container.resolve(
        CreateAppointmentUseCase
      );
      const { provider_id, date } = request.body;
      const appointment = await createAppointmentUseCase.execute({
        date,
        client_id: request.user.id,
        provider_id,
      });
      return response.json(classToClass(appointment));
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }

  public async show(request: Request, response: Response) {
    const findAppointmentUseCase = container.resolve(FindAppointmentUseCase);
    const appointments = await findAppointmentUseCase.execute();
    response.json(classToClass(appointments));
  }
}

import { parseISO } from 'date-fns';
import { Router } from 'express';
import CreateAppointmentUseCase from '@modules/appointments/services/create-appointment.usecase';
import FindAppointmentUseCase from '@modules/appointments/services/find-appointment.usecase';
import { container } from 'tsyringe';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  const findAppointmentUseCase = container.resolve(FindAppointmentUseCase);
  const appointments = await findAppointmentUseCase.execute();
  response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
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
});

export default appointmentsRouter;

import { parseISO } from 'date-fns';
import { Router } from 'express';
import CreateAppointmentUseCase from '../../domain/appointments/create-appointment.usecase';
import FindAppointmentUseCase from '../../domain/appointments/find-appointment.usecase';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  const findAppointmentUseCase = new FindAppointmentUseCase();
  const appointments = await findAppointmentUseCase.execute();
  response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider, date } = request.body;
    const createAppointmentUseCase = new CreateAppointmentUseCase();
    const appointment = await createAppointmentUseCase.execute({
      date: parseISO(date),
      provider,
    });
    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default appointmentsRouter;

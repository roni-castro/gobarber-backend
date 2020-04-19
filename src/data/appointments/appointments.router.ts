import { parseISO } from 'date-fns';
import { Router } from 'express';
import CreateAppointmentUseCase from '../../domain/appointments/create-appointment.usecase';
import FindAppointmentUseCase from '../../domain/appointments/find-appointment.usecase';
import AppointmentRepository from './appointment.repository';

const appointmentsRouter = Router();
const repository = new AppointmentRepository();

appointmentsRouter.get('/', (request, response) => {
  const findAppointmentUseCase = new FindAppointmentUseCase(repository);
  const appointments = findAppointmentUseCase.execute();
  response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, startDate } = request.body;
    const createAppointmentUseCase = new CreateAppointmentUseCase(repository);
    const appointment = createAppointmentUseCase.execute({
      date: parseISO(startDate),
      provider,
    });
    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

export default appointmentsRouter;

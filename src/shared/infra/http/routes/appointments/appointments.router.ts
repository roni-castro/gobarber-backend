import { parseISO } from 'date-fns';
import { Router } from 'express';
import CreateAppointmentUseCase from '@modules/appointments/services/create-appointment.usecase';
import FindAppointmentUseCase from '@modules/appointments/services/find-appointment.usecase';
import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/appointment.repository';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  const appointmentRepository = new AppointmentRepository();
  const findAppointmentUseCase = new FindAppointmentUseCase(
    appointmentRepository
  );
  const appointments = await findAppointmentUseCase.execute();
  response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const appointmentRepository = new AppointmentRepository();
    const createAppointmentUseCase = new CreateAppointmentUseCase(
      appointmentRepository
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

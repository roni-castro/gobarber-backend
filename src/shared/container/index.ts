import { container } from 'tsyringe';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/appointment.repository';

container.registerSingleton<IAppointmentRepository>(
  'AppointmentRepository',
  AppointmentRepository
);

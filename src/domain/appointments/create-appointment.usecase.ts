import { startOfHour } from 'date-fns';
import AppointmentRepository from '../../data/appointments/appointment.repository';
import Appointment from '../../models/appointment.model';

interface AppointmentRequestDTO {
  provider: string;
  date: Date;
}

export default class CreateAppointmentUseCase {
  private repository: AppointmentRepository;

  constructor(appointmentRepository: AppointmentRepository) {
    this.repository = appointmentRepository;
  }

  execute({ provider, date }: AppointmentRequestDTO): Appointment {
    const parsedDate = startOfHour(date);

    if (this.repository.findByDate(parsedDate)) {
      throw new Error('This appointment already exists');
    }
    return this.repository.create({ provider, date: parsedDate });
  }
}

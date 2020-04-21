import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../../data/appointments/appointment.repository';
import Appointment from '../../data/database/entity/appointment.entity';

interface AppointmentRequestDTO {
  provider: string;
  date: Date;
}

export default class CreateAppointmentUseCase {
  async execute({
    provider,
    date,
  }: AppointmentRequestDTO): Promise<Appointment> {
    const repository = getCustomRepository(AppointmentRepository);
    const parsedDate = startOfHour(date);
    const appointmentFound = await repository.findByDate(parsedDate);
    if (appointmentFound) {
      throw new Error('This appointment already exists');
    }
    const appointment = repository.create({ provider, date: parsedDate });
    await repository.save(appointment);
    return appointment;
  }
}

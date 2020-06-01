import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../repositories/appointment.repository';
import Appointment from '../infra/typeorm/entities/appointment.entity';
import AppError from '@shared/error/AppError';

interface AppointmentRequestDTO {
  provider_id: string;
  date: Date;
}

export default class CreateAppointmentUseCase {
  async execute({
    provider_id,
    date,
  }: AppointmentRequestDTO): Promise<Appointment> {
    const repository = getCustomRepository(AppointmentRepository);
    const parsedDate = startOfHour(date);
    const appointmentFound = await repository.findByDate(parsedDate);
    if (appointmentFound) {
      throw new AppError('This appointment already exists');
    }
    const appointment = repository.create({
      provider_id,
      date: parsedDate,
    });
    await repository.save(appointment);
    return appointment;
  }
}

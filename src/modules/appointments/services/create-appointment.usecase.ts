import { startOfHour } from 'date-fns';
import Appointment from '../infra/typeorm/entities/appointment.entity';
import AppError from '@shared/error/AppError';
import { ICreateAppointmentDTO } from '../dtos/AppointmentRequestDTO';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';

export default class CreateAppointmentUseCase {
  constructor(private repository: IAppointmentRepository) {}

  async execute({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const parsedDate = startOfHour(date);
    const appointmentFound = await this.repository.findByDate(parsedDate);
    if (appointmentFound) {
      throw new AppError('This appointment already exists');
    }
    const appointment = await this.repository.create({
      provider_id,
      date: parsedDate,
    });
    return appointment;
  }
}

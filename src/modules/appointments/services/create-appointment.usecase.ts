import { startOfHour, isBefore } from 'date-fns';
import Appointment from '../infra/typeorm/entities/appointment.entity';
import AppError from '@shared/error/AppError';
import { ICreateAppointmentDTO } from '../dtos/AppointmentRequestDTO';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class CreateAppointmentUseCase {
  constructor(
    @inject('AppointmentRepository')
    private repository: IAppointmentRepository
  ) {}

  async execute({
    client_id,
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const parsedDate = startOfHour(date);
    const appointmentFound = await this.repository.findByDate(parsedDate);
    if (appointmentFound) {
      throw new AppError('This appointment already exists');
    }

    if (client_id === provider_id) {
      throw new AppError('You cannot schedule an appointment with yourself');
    }

    const currentDate = Date.now();
    if (isBefore(parsedDate, currentDate)) {
      throw new AppError('You cannot schedule an appointment on a past date');
    }

    const appointment = await this.repository.create({
      client_id,
      provider_id,
      date: parsedDate,
    });
    return appointment;
  }
}

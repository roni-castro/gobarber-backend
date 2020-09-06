import { inject, injectable } from 'tsyringe';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/appointment.entity';

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
  timezone: string;
}

@injectable()
export default class ListProviderAppointmentsUseCase {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository
  ) {}

  async execute({
    providerId,
    day,
    month,
    year,
    timezone,
  }: IRequest): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository.findAllInDayFromProvider(
      {
        providerId,
        day,
        month,
        year,
        timezone,
      }
    );
    return appointments;
  }
}

import { inject, injectable } from 'tsyringe';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/cacheProvider/models/i-cache-provider';
import Appointment from '../infra/typeorm/entities/appointment.entity';
import { format } from 'date-fns';

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

interface IResponse {}

@injectable()
export default class ListProviderAppointmentsUseCase {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  async execute({
    providerId,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const cacheKey = `appointments:${format(
      new Date(year, month - 1, day),
      'yyyy-MM-dd'
    )}`;
    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey
    );
    if (!appointments) {
      appointments = await this.appointmentRepository.findAllInDayFromProvider({
        providerId,
        day,
        month,
        year,
      });
      await this.cacheProvider.save(cacheKey, appointments);
    }
    return appointments;
  }
}

import ptBR, { startOfHour, isBefore, getHours, format } from 'date-fns';

import AppError from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';
import INotificationRepository from '@modules/notifications/repositories/i-notification.repository';
import ICacheProvider from '@shared/container/providers/cacheProvider/models/i-cache-provider';
import Appointment from '../infra/typeorm/entities/appointment.entity';
import { ICreateAppointmentDTO } from '../dtos/AppointmentRequestDTO';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import { FIRST_SERVICE_HOUR, LAST_SERVICE_HOUR } from '../utils/constants';

@injectable()
export default class CreateAppointmentUseCase {
  constructor(
    @inject('AppointmentRepository')
    private repository: IAppointmentRepository,
    @inject('NotificationRepository')
    private notificationRepository: INotificationRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  async execute({
    client_id,
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const parsedDate = startOfHour(date);
    const appointmentFound = await this.repository.findByDate(
      parsedDate,
      provider_id
    );
    if (appointmentFound) {
      throw new AppError('This appointment already exists');
    }

    if (client_id === provider_id) {
      throw new AppError('You cannot schedule an appointment with yourself');
    }

    const firstServiceHourPTBR = +format(
      new Date(parsedDate).setHours(FIRST_SERVICE_HOUR, 0, 0, 0),
      'HH',
      { locale: ptBR }
    );
    const lastServiceHourPTBR = +format(
      new Date(parsedDate).setHours(LAST_SERVICE_HOUR, 0, 0, 0),
      'HH',
      { locale: ptBR }
    );
    console.log(
      'create-appointment',
      parsedDate,
      firstServiceHourPTBR,
      lastServiceHourPTBR
    );
    console.log(new Date());
    if (
      getHours(parsedDate) < firstServiceHourPTBR ||
      getHours(parsedDate) > lastServiceHourPTBR
    ) {
      throw new AppError(
        `You can only create an appointment between ${FIRST_SERVICE_HOUR}h and ${LAST_SERVICE_HOUR}h`
      );
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

    const dateFormatted = format(parsedDate, "dd/MM/yyyy 'às' HH:mm'h'");
    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    });
    await this.cacheProvider.invalidate(
      `appointments:${provider_id}-${format(parsedDate, 'yyyy-MM-dd')}`
    );
    return appointment;
  }
}

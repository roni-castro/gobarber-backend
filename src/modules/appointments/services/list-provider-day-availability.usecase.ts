import { inject, injectable } from 'tsyringe';
import { isAfter } from 'date-fns';
import * as moment from 'moment-timezone';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import {
  NUMBER_OF_SERVICE_HOURS_A_DAY,
  FIRST_SERVICE_HOUR,
} from '../utils/constants';

interface IRequest {
  userId: string;
  day: number;
  month: number;
  year: number;
  timezone: string;
}

type IResponse = Array<{
  hour: number;
  availability: boolean;
}>;

@injectable()
export default class ListDayAvailabilityProvidersUseCase {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository
  ) {}

  async execute({
    userId,
    day,
    month,
    year,
    timezone,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentRepository.findAllInDayFromProvider(
      {
        providerId: userId,
        month,
        year,
        day,
      }
    );
    const hoursOfTheDay = Array.from(
      { length: NUMBER_OF_SERVICE_HOURS_A_DAY },
      (_, index) => FIRST_SERVICE_HOUR + index
    );
    const providerAvailabilityHours: IResponse = hoursOfTheDay.map(hour => {
      const hasAppointmentOnCurrentHour = appointments.find(appointment => {
        const hourInUtcTimeZone = +moment
          .tz(appointment.date, timezone)
          .format('HH');

        return hourInUtcTimeZone === hour;
      });
      const currentDate = new Date(Date.now());
      const dateToBeScheduled = new Date(year, month - 1, day, hour);
      return {
        hour,
        availability:
          !hasAppointmentOnCurrentHour &&
          isAfter(dateToBeScheduled, currentDate),
      };
    });
    return providerAvailabilityHours;
  }
}

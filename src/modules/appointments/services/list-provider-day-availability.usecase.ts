import { inject, injectable } from 'tsyringe';
import { isAfter, getHours } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
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
        timezone,
      }
    );
    const hoursOfTheDay = Array.from(
      { length: NUMBER_OF_SERVICE_HOURS_A_DAY },
      (_, index) => FIRST_SERVICE_HOUR + index
    );
    const providerAvailabilityHours: IResponse = hoursOfTheDay.map(hour => {
      const hasAppointmentOnCurrentHour = appointments.find(appointment => {
        const appointmentDateInTZ = utcToZonedTime(appointment.date, timezone);
        return getHours(appointmentDateInTZ) === hour;
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

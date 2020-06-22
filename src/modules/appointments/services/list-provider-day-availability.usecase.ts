import { inject, injectable } from 'tsyringe';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import { getHours, isAfter } from 'date-fns';
import {
  NUMBER_OF_SERVICE_HOURS_A_DAY,
  FIRST_SERVICE_HOUR,
} from '../utils/constants';

interface IRequest {
  userId: string;
  day: number;
  month: number;
  year: number;
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

  async execute({ userId, day, month, year }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentRepository.findAllInDayFromProvider({
      providerId: userId,
      month,
      year,
      day,
    });
    const hoursOfTheDay = Array.from(
      { length: NUMBER_OF_SERVICE_HOURS_A_DAY },
      (_, index) => FIRST_SERVICE_HOUR + index
    );
    const providerAvailabilityHours: IResponse = hoursOfTheDay.map(hour => {
      const hasAppointmentOnCurrentHour = appointments.find(
        appointment => getHours(appointment.date) === hour
      );
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

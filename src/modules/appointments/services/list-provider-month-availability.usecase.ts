import { inject, injectable } from 'tsyringe';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';
import { NUMBER_OF_SERVICE_HOURS_A_DAY } from '../utils/constants';

interface IRequest {
  userId: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  availability: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityUseCase {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository
  ) {}

  async execute({ userId, month, year }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentRepository.findAllInMonthFromProvider(
      {
        providerId: userId,
        month,
        year,
      }
    );
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    const daysOfTheMonth = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1
    );
    const providerAvailabilityDays: IResponse = daysOfTheMonth.map(day => {
      const currentDate = new Date(Date.now());
      const dateToBeCompared = new Date(year, month - 1, day, 23, 59, 59);
      const isAppointmentDateInFuture = isAfter(dateToBeCompared, currentDate);
      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day
      );
      return {
        day,
        availability:
          isAppointmentDateInFuture &&
          appointmentsInDay.length < NUMBER_OF_SERVICE_HOURS_A_DAY,
      };
    });
    return providerAvailabilityDays;
  }
}

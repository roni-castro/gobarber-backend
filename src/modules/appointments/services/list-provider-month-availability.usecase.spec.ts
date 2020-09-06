import ListProviderMonthAvailabilityUseCase from './list-provider-month-availability.usecase';
import FakeAppointmentRepository from '../repositories/fakes/fake-appointment.repository';
import {
  NUMBER_OF_SERVICE_HOURS_A_DAY,
  FIRST_SERVICE_HOUR,
} from '../utils/constants';

describe('ListProviderMonthAvailabilityUseCase', () => {
  let fakeAppointmentRepository: FakeAppointmentRepository;
  let listProviderMonthAvailabilityUseCase: ListProviderMonthAvailabilityUseCase;
  const DEFAULT_TIMEZONE = 'UTC';

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderMonthAvailabilityUseCase = new ListProviderMonthAvailabilityUseCase(
      fakeAppointmentRepository
    );
  });

  it('should list all days of the month available of a provider', async () => {
    const currentDateMock = new Date(2020, 0, 30, 8, 0, 0);
    jest.spyOn(Date, 'now').mockReturnValue(currentDateMock.getTime());
    const providerId = 'provider_id';
    const clientId = 'client_id';
    const allHoursOfService = Array.from(
      { length: NUMBER_OF_SERVICE_HOURS_A_DAY },
      (_, index) => index + FIRST_SERVICE_HOUR
    );
    await Promise.all(
      allHoursOfService.map(hour =>
        fakeAppointmentRepository.create({
          date: new Date(2020, 4, 16, hour),
          provider_id: providerId,
          client_id: clientId,
        })
      )
    );

    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 18, 9),
      provider_id: providerId,
      client_id: clientId,
    });

    const response = await listProviderMonthAvailabilityUseCase.execute({
      userId: providerId,
      month: 5,
      year: 2020,
      timezone: DEFAULT_TIMEZONE,
    });
    expect(response).toEqual(
      expect.arrayContaining([
        { day: 16, availability: false },
        { day: 17, availability: true },
        { day: 18, availability: true },
        { day: 19, availability: true },
      ])
    );
  });

  it('should list all days of the month as unavailable for past months', async () => {
    const currentDateMock = new Date(2020, 0, 30, 8, 0, 0);
    jest.spyOn(Date, 'now').mockReturnValue(currentDateMock.getTime());
    const providerId = 'provider_id';

    const response = await listProviderMonthAvailabilityUseCase.execute({
      userId: providerId,
      month: 12,
      year: 2019,
      timezone: DEFAULT_TIMEZONE,
    });
    const daysOfTheMonth = Array.from({ length: 31 }, (_, index) => index + 1);
    const expectedAvailabilityResult = daysOfTheMonth.map(day => ({
      day,
      availability: false,
    }));
    expect(response).toEqual(
      expect.arrayContaining(expectedAvailabilityResult)
    );
  });

  it('should not list days that belongs to another month on some timezones', async () => {
    const currentDateMock = new Date(2020, 0, 30, 8, 0, 0);
    jest.spyOn(Date, 'now').mockReturnValue(currentDateMock.getTime());
    const providerId = 'provider_id';
    const clientId = 'client_id';
    const allHoursOfService = Array.from(
      { length: NUMBER_OF_SERVICE_HOURS_A_DAY },
      (_, index) => index + FIRST_SERVICE_HOUR
    );
    await Promise.all(
      // 14h-17h in Sao_Paulo = next day 00-04h in Indian/Christmas, so the month continues available
      allHoursOfService.map(hour =>
        fakeAppointmentRepository.create({
          date: new Date(2020, 4, 16, hour),
          provider_id: providerId,
          client_id: clientId,
        })
      )
    );

    const TIMEZONE_INDIAN_CHRISTMAS = 'Indian/Christmas';
    const response = await listProviderMonthAvailabilityUseCase.execute({
      userId: providerId,
      month: 5,
      year: 2020,
      timezone: TIMEZONE_INDIAN_CHRISTMAS,
    });
    expect(response).toEqual(
      expect.arrayContaining([
        { day: 16, availability: true },
        { day: 17, availability: true },
        { day: 18, availability: true },
      ])
    );
  });
});

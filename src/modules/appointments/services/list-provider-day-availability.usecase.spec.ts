import FakeAppointmentRepository from '../repositories/fakes/fake-appointment.repository';
import ListProviderDayAvailabilityUseCase from './list-provider-day-availability.usecase';

describe('ListProviderDayAvailabilityUseCase', () => {
  let fakeAppointmentRepository: FakeAppointmentRepository;
  let listProviderDayAvailabilityUseCase: ListProviderDayAvailabilityUseCase;

  const clientId = 'client_id';
  const providerId = 'provider_id';

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderDayAvailabilityUseCase = new ListProviderDayAvailabilityUseCase(
      fakeAppointmentRepository
    );
  });

  it('should list all hours of the day available of a provider', async () => {
    const currentDateMock = new Date(2020, 4, 20, 7, 0, 0);
    jest.spyOn(Date, 'now').mockReturnValue(currentDateMock.getTime());

    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 8),
      provider_id: providerId,
      client_id: clientId,
    });

    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 10),
      provider_id: providerId,
      client_id: clientId,
    });

    const response = await listProviderDayAvailabilityUseCase.execute({
      userId: providerId,
      day: 20,
      month: 5,
      year: 2020,
      timezone: 'UTC',
    });
    expect(response).toEqual(
      expect.arrayContaining([
        { hour: 8, availability: false },
        { hour: 9, availability: true },
        { hour: 10, availability: false },
        { hour: 11, availability: true },
      ])
    );
  });

  it('should not return hours as available when it is on the past', async () => {
    const currentDateMock = new Date(2020, 4, 20, 10, 30, 0);
    jest.spyOn(Date, 'now').mockReturnValue(currentDateMock.getTime());

    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 12),
      provider_id: providerId,
      client_id: clientId,
    });
    const response = await listProviderDayAvailabilityUseCase.execute({
      userId: providerId,
      day: 20,
      month: 5,
      year: 2020,
      timezone: 'UTC',
    });

    expect(response).toEqual(
      expect.arrayContaining([
        { hour: 8, availability: false },
        { hour: 9, availability: false },
        { hour: 10, availability: false },
        { hour: 11, availability: true },
        { hour: 12, availability: false },
        { hour: 13, availability: true },
      ])
    );
  });

  it('should return hour availability correctly based on timezone Indian/Christmas near start/end service', async () => {
    const currentDateMock = new Date(2020, 4, 20, 6, 30, 0); // 06:30 UTC
    jest.spyOn(Date, 'now').mockReturnValue(currentDateMock.getTime());
    const TIMEZONE_INDIAN_CHRISTMAS = 'Indian/Christmas';

    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 1), // 1h Indian/Christmas = 8h UTC
      provider_id: providerId,
      client_id: clientId,
    });
    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 10), // 10h Indian/Christmas = 17h UTC
      provider_id: providerId,
      client_id: clientId,
    });
    const response = await listProviderDayAvailabilityUseCase.execute({
      userId: providerId,
      day: 20,
      month: 5,
      year: 2020,
      timezone: TIMEZONE_INDIAN_CHRISTMAS,
    });

    expect(response).toEqual(
      expect.arrayContaining([
        { hour: 8, availability: false },
        { hour: 9, availability: true },
        { hour: 16, availability: true },
        { hour: 17, availability: false },
      ])
    );
  });

  it('should return hour availability correctly based on timezone Indian/Christmas near last service', async () => {
    const currentDateMock = new Date(2020, 4, 20, 15, 30, 0); // 15:30 UTC
    jest.spyOn(Date, 'now').mockReturnValue(currentDateMock.getTime());
    const TIMEZONE_INDIAN_CHRISTMAS = 'Indian/Christmas';

    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 10), // 10h Indian/Christmas = 17h UTC
      provider_id: providerId,
      client_id: clientId,
    });
    const response = await listProviderDayAvailabilityUseCase.execute({
      userId: providerId,
      day: 20,
      month: 5,
      year: 2020,
      timezone: TIMEZONE_INDIAN_CHRISTMAS,
    });

    expect(response).toEqual(
      expect.arrayContaining([
        { hour: 14, availability: false },
        { hour: 15, availability: false },
        { hour: 16, availability: true },
        { hour: 17, availability: false },
      ])
    );
  });
});

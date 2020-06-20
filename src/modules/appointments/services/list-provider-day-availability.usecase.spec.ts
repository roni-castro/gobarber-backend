import FakeAppointmentRepository from '../repositories/fakes/fake-appointment.repository';
import ListProviderDayAvailabilityUseCase from './list-provider-day-availability.usecase';

describe('ListProviderDayAvailabilityUseCase', () => {
  let fakeAppointmentRepository: FakeAppointmentRepository;
  let listProviderDayAvailabilityUseCase: ListProviderDayAvailabilityUseCase;

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderDayAvailabilityUseCase = new ListProviderDayAvailabilityUseCase(
      fakeAppointmentRepository
    );
  });

  it('should list all hours of the day available of a provider', async () => {
    const providerId = 'provider_id';

    const currentDateMock = new Date(2020, 4, 20, 7, 0, 0);
    jest.spyOn(Date, 'now').mockReturnValue(currentDateMock.getTime());

    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 8),
      provider_id: providerId,
    });

    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 10),
      provider_id: providerId,
    });

    const response = await listProviderDayAvailabilityUseCase.execute({
      userId: providerId,
      day: 20,
      month: 5,
      year: 2020,
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
    const providerId = 'provider_id';
    const currentDateMock = new Date(2020, 4, 20, 10, 30, 0);
    jest.spyOn(Date, 'now').mockReturnValue(currentDateMock.getTime());

    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 20, 12),
      provider_id: providerId,
    });

    const response = await listProviderDayAvailabilityUseCase.execute({
      userId: providerId,
      day: 20,
      month: 5,
      year: 2020,
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
});

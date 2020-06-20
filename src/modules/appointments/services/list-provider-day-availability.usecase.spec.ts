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
      ])
    );
  });
});

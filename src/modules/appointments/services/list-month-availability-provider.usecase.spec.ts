import fakeAppointmentRepository from '../../users/repositories/fakes/fake-user.repository';
import ListMonthAvailabilityProvidersUseCase from './list-month-availability-provider.usecase';
import FakeAppointmentRepository from '../repositories/fakes/fake-appointment.repository';
import {
  NUMBER_OF_SERVICE_HOURS_A_DAY,
  FIRST_SERVICE_HOUR,
} from '../utils/constants';

describe('ListMonthAvailabilityProvidersUseCase', () => {
  let fakeAppointmentRepository: FakeAppointmentRepository;
  let listMonthAvailabilityProvidersUseCase: ListMonthAvailabilityProvidersUseCase;

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listMonthAvailabilityProvidersUseCase = new ListMonthAvailabilityProvidersUseCase(
      fakeAppointmentRepository
    );
  });

  it('should list all days of the month available of a provider', async () => {
    const providerId = 'provider_id';
    const allHoursOfService = Array.from(
      { length: NUMBER_OF_SERVICE_HOURS_A_DAY },
      (_, index) => index + FIRST_SERVICE_HOUR
    );
    await Promise.all(
      allHoursOfService.map(hour =>
        fakeAppointmentRepository.create({
          date: new Date(2020, 4, 16, hour),
          provider_id: providerId,
        })
      )
    );

    await fakeAppointmentRepository.create({
      date: new Date(2020, 4, 18, 9),
      provider_id: providerId,
    });

    const response = await listMonthAvailabilityProvidersUseCase.execute({
      userId: providerId,
      month: 5,
      year: 2020,
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
});

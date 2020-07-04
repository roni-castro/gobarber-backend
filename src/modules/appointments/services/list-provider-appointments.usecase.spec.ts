import ListProviderAppointmentsUseCase from './list-provider-appointments.usecase';
import FakeAppointmentRepository from '../repositories/fakes/fake-appointment.repository';
import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/fake-cache-provider';

describe('ListProviderAppointmentsUseCase', () => {
  let fakeAppointmentRepository: FakeAppointmentRepository;
  let fakeCacheProvider: FakeCacheProvider;
  let listProviderAppointmentsUseCase: ListProviderAppointmentsUseCase;
  const providerId = 'provider_id';
  const clientId = 'client_id';

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(new Date(2020, 1, 1).getTime());
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointmentsUseCase = new ListProviderAppointmentsUseCase(
      fakeAppointmentRepository,
      fakeCacheProvider
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should list all provider appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentRepository.create({
      provider_id: providerId,
      client_id: clientId,
      date: new Date(2020, 4, 1, 8),
    });

    const appointment2 = await fakeAppointmentRepository.create({
      provider_id: providerId,
      client_id: clientId,
      date: new Date(2020, 4, 1, 10),
    });

    const appointments = await listProviderAppointmentsUseCase.execute({
      providerId,
      day: 1,
      month: 5,
      year: 2020,
    });
    expect(
      await fakeCacheProvider.recover(`appointments:${providerId}-2020-05-01`)
    ).toHaveLength(2);
    expect(appointments).toEqual([appointment1, appointment2]);
  });
});

import AppError from '@shared/error/AppError';
import FakeNotificationRepository from '@modules/notifications/repositories/fakes/fake-notification.repository';
import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/fake-cache-provider';
import CreateAppointmentUseCase from './create-appointment.usecase';
import FakeAppointmentRepository from '../repositories/fakes/fake-appointment.repository';
import { FIRST_SERVICE_HOUR, LAST_SERVICE_HOUR } from '../utils/constants';

let fakeAppointmentRepository: FakeAppointmentRepository;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointmentUseCase: CreateAppointmentUseCase;

describe('CreateAppointment', () => {
  const clientId = 'client_id';
  const providerId = 'provider_id';
  const currentDate = new Date(2020, 0, 20);
  const appointmentDate = new Date(2020, 0, 30, 8, 0, 0);
  const TIMEZONE_AMERICA_SP = 'America/Sao_Paulo';
  const TIMEZONE_UTC = 'UTC';

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeNotificationRepository = new FakeNotificationRepository();
    createAppointmentUseCase = new CreateAppointmentUseCase(
      fakeAppointmentRepository,
      fakeNotificationRepository,
      fakeCacheProvider
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
    const appointment = await createAppointmentUseCase.execute({
      provider_id: providerId,
      client_id: clientId,
      date: appointmentDate,
      timezone: TIMEZONE_UTC,
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(providerId);
  });

  it('should clear cache of a specific day when a new appointment is registed on it', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
    fakeCacheProvider.save('appointments:2020-01-30', { value: 'anyvalue' });
    const appointment = await createAppointmentUseCase.execute({
      provider_id: providerId,
      client_id: clientId,
      date: appointmentDate,
      timezone: TIMEZONE_UTC,
    });
    expect(await fakeCacheProvider.recover('appointments:')).toBeNull();
    expect(appointment.provider_id).toBe(providerId);
  });

  it('should not clear cache of a specific day when a new appointment is registed on different day', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
    const invalidateMock = jest.spyOn(fakeCacheProvider, 'invalidate');
    const appointment = await createAppointmentUseCase.execute({
      provider_id: providerId,
      client_id: clientId,
      date: appointmentDate,
      timezone: TIMEZONE_UTC,
    });
    expect(invalidateMock).toHaveBeenCalledWith(
      'appointments:provider_id-2020-01-30'
    );
    expect(appointment.provider_id).toBe(providerId);
  });

  it('should not be able to create two appointments at the same time', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
    await createAppointmentUseCase.execute({
      provider_id: providerId,
      client_id: clientId,
      date: appointmentDate,
      timezone: TIMEZONE_UTC,
    });

    await expect(
      createAppointmentUseCase.execute({
        provider_id: providerId,
        client_id: clientId,
        date: appointmentDate,
        timezone: TIMEZONE_UTC,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create two appointments at the same time when have diferent provider', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
    await createAppointmentUseCase.execute({
      provider_id: 'provider_id_1',
      client_id: clientId,
      date: appointmentDate,
      timezone: TIMEZONE_UTC,
    });

    const response = await createAppointmentUseCase.execute({
      provider_id: 'provider_id_2',
      client_id: clientId,
      date: appointmentDate,
      timezone: TIMEZONE_UTC,
    });
    await expect(response.provider_id).toBe('provider_id_2');
  });

  it('should not be able to create appointment on a past date', async () => {
    await expect(
      createAppointmentUseCase.execute({
        provider_id: providerId,
        client_id: clientId,
        date: currentDate,
        timezone: TIMEZONE_UTC,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment on a past hour', async () => {
    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(new Date(2020, 4, 20, 10, 10, 0).getTime());
    const appointmentDateInThePast = new Date(2020, 4, 20, 10, 0, 0);
    await expect(
      createAppointmentUseCase.execute({
        provider_id: providerId,
        client_id: clientId,
        date: appointmentDateInThePast,
        timezone: TIMEZONE_UTC,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment when user and provider are the same person', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
    await expect(
      createAppointmentUseCase.execute({
        provider_id: providerId,
        client_id: providerId,
        date: appointmentDate,
        timezone: TIMEZONE_UTC,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before first allowed service hour (8h)', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
    appointmentDate.setHours(FIRST_SERVICE_HOUR - 1);
    await expect(
      createAppointmentUseCase.execute({
        provider_id: providerId,
        client_id: clientId,
        date: appointmentDate,
        timezone: TIMEZONE_UTC,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment after last allowed service hour (17h)', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
    appointmentDate.setHours(LAST_SERVICE_HOUR + 1);
    await expect(
      createAppointmentUseCase.execute({
        provider_id: providerId,
        client_id: clientId,
        date: appointmentDate,
        timezone: TIMEZONE_UTC,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  describe('specific timezone', () => {
    it('should be able to create an appointment in different timezone at the first service hour', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
      const firstServiceHourInAmericaSP = FIRST_SERVICE_HOUR + 3; // 8h in America/Sao_Paulo
      const appointmentDateInAmericaSP8h = new Date(
        2020,
        4,
        20,
        firstServiceHourInAmericaSP
      );
      const response = await createAppointmentUseCase.execute({
        provider_id: 'provider_id',
        client_id: clientId,
        date: appointmentDateInAmericaSP8h,
        timezone: TIMEZONE_AMERICA_SP,
      });
      expect(response.date.getHours()).toBe(
        appointmentDateInAmericaSP8h.getHours()
      );
    });
    it('should be able to create an appointment in different timezone at the end service hour', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
      const lastServiceHourInAmericaSP = LAST_SERVICE_HOUR + 3; // 17h in America/Sao_Paulo
      const appointmentDateInAmericaSP17h = new Date(
        2020,
        4,
        20,
        lastServiceHourInAmericaSP
      );

      const response = await createAppointmentUseCase.execute({
        provider_id: 'provider_id_1',
        client_id: clientId,
        date: appointmentDateInAmericaSP17h,
        timezone: TIMEZONE_AMERICA_SP,
      });
      expect(response.date.getHours()).toBe(
        appointmentDateInAmericaSP17h.getHours()
      );
    });

    it('should be not able to create an appointment in different timezone before the first service hour', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
      const beforeFirstServiceHourInAmericaSP = FIRST_SERVICE_HOUR - 1 + 3; // 7h in America/Sao_Paulo (+3h)
      const appointmentDateBeforeFirstServiceHourInAmericaSP = new Date(
        2020,
        4,
        20,
        beforeFirstServiceHourInAmericaSP
      );
      await expect(
        createAppointmentUseCase.execute({
          provider_id: providerId,
          client_id: clientId,
          date: appointmentDateBeforeFirstServiceHourInAmericaSP,
          timezone: TIMEZONE_AMERICA_SP,
        })
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should be not able to create an appointment in different timezone after the end service hour', async () => {
      jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
      const afterLastServiceHourInAmericaSP = LAST_SERVICE_HOUR + 1 + 3; // 17h in America/Sao_Paulo (+3h)
      const appointmentDateAfterLastServiceHourInAmericaSP = new Date(
        2020,
        4,
        20,
        afterLastServiceHourInAmericaSP
      );

      await expect(
        createAppointmentUseCase.execute({
          provider_id: providerId,
          client_id: clientId,
          date: appointmentDateAfterLastServiceHourInAmericaSP,
          timezone: TIMEZONE_AMERICA_SP,
        })
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});

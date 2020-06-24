import CreateAppointmentUseCase from './create-appointment.usecase';
import FakeAppointmentRepository from '../repositories/fakes/fake-appointment.repository';
import AppError from '@shared/error/AppError';
import { FIRST_SERVICE_HOUR, LAST_SERVICE_HOUR } from '../utils/constants';
import FakeNotificationRepository from '@modules/notifications/repositories/fakes/fake-notification.repository';

let fakeAppointmentRepository: FakeAppointmentRepository;
let fakeNotificationRepository: FakeNotificationRepository;
let createAppointmentUseCase: CreateAppointmentUseCase;

describe('CreateAppointment', () => {
  const clientId = 'client_id';
  const providerId = 'provider_id';
  const currentDate = new Date(2020, 1, 30);
  const appointmentDate = new Date(2020, 1, 30, 8, 0, 0);

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    createAppointmentUseCase = new CreateAppointmentUseCase(
      fakeAppointmentRepository,
      fakeNotificationRepository
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
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(providerId);
  });

  it('should not be able to create two appointments at the same time', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
    await createAppointmentUseCase.execute({
      provider_id: providerId,
      client_id: clientId,
      date: appointmentDate,
    });

    await expect(
      createAppointmentUseCase.execute({
        provider_id: providerId,
        client_id: clientId,
        date: appointmentDate,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment on a past date', async () => {
    await expect(
      createAppointmentUseCase.execute({
        provider_id: providerId,
        client_id: clientId,
        date: currentDate,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment on a past hour', async () => {
    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(new Date(2020, 4, 20, 10, 10, 0).getTime());
    const appointmentDate = new Date(2020, 4, 20, 10, 0, 0);
    await expect(
      createAppointmentUseCase.execute({
        provider_id: providerId,
        client_id: clientId,
        date: appointmentDate,
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
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

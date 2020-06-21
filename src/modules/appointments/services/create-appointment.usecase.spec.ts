import CreateAppointmentUseCase from './create-appointment.usecase';
import FakeAppointmentRepository from '../repositories/fakes/fake-appointment.repository';
import AppError from '@shared/error/AppError';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointmentUseCase: CreateAppointmentUseCase;

describe('CreateAppointment', () => {
  const clientId = 'client_id';
  const providerId = 'provider_id';

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointmentUseCase = new CreateAppointmentUseCase(
      fakeAppointmentRepository
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(new Date(2020, 1, 30).getTime());
    const date = new Date();
    const appointment = await createAppointmentUseCase.execute({
      provider_id: providerId,
      client_id: clientId,
      date,
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(providerId);
  });

  it('should not be able to create two appointments at the same time', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(new Date(2020, 1, 30).getTime());
    const appointmentDate = new Date();
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
    const appointmentOnPastDate = new Date(2020, 1, 30);

    await expect(
      createAppointmentUseCase.execute({
        provider_id: providerId,
        client_id: clientId,
        date: appointmentOnPastDate,
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
});

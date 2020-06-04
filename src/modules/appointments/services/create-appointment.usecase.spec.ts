import CreateAppointmentUseCase from './create-appointment.usecase';
import FakeAppointmentRepository from '../repositories/fakes/fake-appointment.repository';
import AppError from '@shared/error/AppError';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointmentUseCase = new CreateAppointmentUseCase(
      fakeAppointmentRepository
    );
    const date = new Date();
    const appointment = await createAppointmentUseCase.execute({
      provider_id: '123',
      date,
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123');
  });

  it('should not be able to create two appointments at the same time', async () => {
    const fakeAppointmentRepository = new FakeAppointmentRepository();
    const createAppointmentUseCase = new CreateAppointmentUseCase(
      fakeAppointmentRepository
    );
    const appointmentDate = new Date();
    await createAppointmentUseCase.execute({
      provider_id: '123',
      date: appointmentDate,
    });

    expect(
      createAppointmentUseCase.execute({
        provider_id: '123',
        date: appointmentDate,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

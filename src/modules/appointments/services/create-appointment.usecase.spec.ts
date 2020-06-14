import CreateAppointmentUseCase from './create-appointment.usecase';
import FakeAppointmentRepository from '../repositories/fakes/fake-appointment.repository';
import AppError from '@shared/error/AppError';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointmentUseCase: CreateAppointmentUseCase;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointmentUseCase = new CreateAppointmentUseCase(
      fakeAppointmentRepository
    );
  });

  it('should be able to create a new appointment', async () => {
    const date = new Date();
    const appointment = await createAppointmentUseCase.execute({
      provider_id: '123',
      date,
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123');
  });

  it('should not be able to create two appointments at the same time', async () => {
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

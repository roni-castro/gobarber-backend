import Appointment from '../infra/typeorm/entities/appointment.entity';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class FindAppointmentUseCase {
  constructor(
    @inject('AppointmentRepository')
    private repository: IAppointmentRepository
  ) {}

  execute(): Promise<Appointment[]> {
    return this.repository.find();
  }
}

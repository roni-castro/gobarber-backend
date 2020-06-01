import Appointment from '../infra/typeorm/entities/appointment.entity';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';

export default class FindAppointmentUseCase {
  constructor(private repository: IAppointmentRepository) {}

  execute(): Promise<Appointment[]> {
    return this.repository.find();
  }
}

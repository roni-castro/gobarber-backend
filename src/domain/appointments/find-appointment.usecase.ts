import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../../data/appointments/appointment.repository';
import Appointment from '../../data/database/entity/appointment.entity';

export default class FindAppointmentUseCase {
  execute(): Promise<Appointment[]> {
    const repository = getCustomRepository(AppointmentRepository);
    return repository.find();
  }
}

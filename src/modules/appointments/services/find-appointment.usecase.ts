import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../repositories/appointment.repository';
import Appointment from '../infra/typeorm/entities/appointment.entity';

export default class FindAppointmentUseCase {
  execute(): Promise<Appointment[]> {
    const repository = getCustomRepository(AppointmentRepository);
    return repository.find();
  }
}

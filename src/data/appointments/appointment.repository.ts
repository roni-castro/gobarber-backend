import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../database/entity/appointments.entity';

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment> {
  async findByDate(date: Date): Promise<Appointment | null> {
    const foundAppointmentInSameDate = await this.findOne({
      where: { date },
    });
    return foundAppointmentInSameDate || null;
  }
}

export default AppointmentRepository;

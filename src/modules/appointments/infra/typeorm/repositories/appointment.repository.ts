import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../entities/appointment.entity';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment>
  implements IAppointmentRepository {
  async findByDate(date: Date): Promise<Appointment | undefined> {
    const foundAppointmentInSameDate = await this.findOne({
      where: { date },
    });
    return foundAppointmentInSameDate;
  }
}

export default AppointmentRepository;

import Appointment from '../infra/typeorm/entities/appointment.entity';

export default interface IAppointmentRepository {
  findByDate(date: Date): Promise<Appointment | undefined>;
}

import Appointment from '../infra/typeorm/entities/appointment.entity';
import { ICreateAppointmentDTO } from '../dtos/AppointmentRequestDTO';

export default interface IAppointmentRepository {
  find(): Promise<Appointment[]>;
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}

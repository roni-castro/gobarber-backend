import Appointment from '../infra/typeorm/entities/appointment.entity';
import { ICreateAppointmentDTO } from '../dtos/AppointmentRequestDTO';
import IFindAppointmentDTO from './dtos/filter-appointment.dto';

export default interface IAppointmentRepository {
  find(): Promise<Appointment[]>;
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date, providerId: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(filter: IFindAppointmentDTO): Promise<Appointment[]>;
  findAllInDayFromProvider(filter: IFindAppointmentDTO): Promise<Appointment[]>;
}

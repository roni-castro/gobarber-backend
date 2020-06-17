import Appointment from '../infra/typeorm/entities/appointment.entity';
import { ICreateAppointmentDTO } from '../dtos/AppointmentRequestDTO';
import IFindAppointmentInMonthDTO from './dtos/filter-appointment.dto';

export default interface IAppointmentRepository {
  find(): Promise<Appointment[]>;
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllProviderInMonth(filter: IFindAppointmentInMonthDTO): Promise<Appointment[]>;
}

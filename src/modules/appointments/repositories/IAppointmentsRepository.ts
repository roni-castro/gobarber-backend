import Appointment from '../infra/typeorm/entities/appointment.entity';
import { ICreateAppointmentDTO } from '../dtos/AppointmentRequestDTO';
import IFindAppointmentDTO from './dtos/filter-appointment.dto';

export default interface IAppointmentRepository {
  find(): Promise<Appointment[]>;
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllProviderInMonth(
    filter: IFindAppointmentDTO
  ): Promise<Appointment[]>;
  findAllProviderInDay(
    filter: IFindAppointmentDTO
  ): Promise<Appointment[]>;
}

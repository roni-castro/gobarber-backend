import { uuid } from 'uuidv4';
import { isEqual, getYear, getMonth, getDate } from 'date-fns';

import Appointment from '../../infra/typeorm/entities/appointment.entity';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { ICreateAppointmentDTO } from '@modules/appointments/dtos/AppointmentRequestDTO';
import IFindAppointmentDTO from '../dtos/filter-appointment.dto';

class FakeAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  async find() {
    return this.appointments;
  }

  async findAllProviderInMonth({
    providerId,
    year,
    month,
  }: IFindAppointmentDTO) {
    return this.appointments.filter(
      appointment =>
        appointment.provider_id === providerId &&
        getYear(appointment.date) === year &&
        getMonth(appointment.date) + 1 == month
    );
  }

  async findAllProviderInDay({
    providerId,
    year,
    month,
    day,
  }: IFindAppointmentDTO) {
    return this.appointments.filter(
      appointment =>
        appointment.provider_id === providerId &&
        getYear(appointment.date) === year &&
        getMonth(appointment.date) + 1 == month &&
        getDate(appointment.date) === day
    );
  }

  async create({ date, provider_id }: ICreateAppointmentDTO) {
    const appointment = new Appointment();
    Object.assign(appointment, { id: uuid(), date, provider_id });
    this.appointments.push(appointment);
    return appointment;
  }

  async findByDate(date: Date): Promise<Appointment | undefined> {
    return this.appointments.find(appointment =>
      isEqual(appointment.date, date)
    );
  }
}

export default FakeAppointmentRepository;

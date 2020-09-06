import { uuid } from 'uuidv4';
import { isEqual, getYear, getMonth, getDate } from 'date-fns';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { ICreateAppointmentDTO } from '@modules/appointments/dtos/AppointmentRequestDTO';
import { utcToZonedTime } from 'date-fns-tz';
import Appointment from '../../infra/typeorm/entities/appointment.entity';
import IFindAppointmentDTO from '../dtos/filter-appointment.dto';

class FakeAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  async find(): Promise<Appointment[]> {
    return this.appointments;
  }

  async findAllInMonthFromProvider({
    providerId,
    year,
    month,
    timezone,
  }: IFindAppointmentDTO): Promise<Appointment[]> {
    return this.appointments.filter(appointment => {
      const appointmentDateInTimezone = utcToZonedTime(
        appointment.date,
        timezone
      );
      return (
        appointment.provider_id === providerId &&
        getYear(appointmentDateInTimezone) === year &&
        getMonth(appointmentDateInTimezone) + 1 === month
      );
    });
  }

  async findAllInDayFromProvider({
    providerId,
    year,
    month,
    day,
    timezone,
  }: IFindAppointmentDTO): Promise<Appointment[]> {
    return this.appointments.filter(appointment => {
      const appointmentDateInTimezone = utcToZonedTime(
        appointment.date,
        timezone
      );
      return (
        appointment.provider_id === providerId &&
        getYear(appointmentDateInTimezone) === year &&
        getMonth(appointmentDateInTimezone) + 1 === month &&
        getDate(appointmentDateInTimezone) === day
      );
    });
  }

  async create({
    date,
    provider_id,
    client_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();
    Object.assign(appointment, { id: uuid(), date, provider_id, client_id });
    this.appointments.push(appointment);
    return appointment;
  }

  async findByDate(
    date: Date,
    providerId: string
  ): Promise<Appointment | undefined> {
    return this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === providerId
    );
  }
}

export default FakeAppointmentRepository;

import { isEqual } from 'date-fns';
import Appointment from '../../models/appointment.model';

interface CreateAppointmentDTO {
  provider: string;
  date: Date;
}

class AppointmentRepository {
  private appointments: Appointment[];

  constructor() {
    this.appointments = [];
  }

  findByDate(date: Date): Appointment | null {
    const findAppointmentInSameDate = this.appointments.find(appointment =>
      isEqual(appointment.date, date)
    );
    return findAppointmentInSameDate || null;
  }

  all(): Appointment[] {
    return this.appointments;
  }

  create({ provider, date }: CreateAppointmentDTO): Appointment {
    const appointment = new Appointment({ provider, date });
    this.appointments.push(appointment);
    return appointment;
  }
}

export default AppointmentRepository;

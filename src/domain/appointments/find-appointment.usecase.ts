import AppointmentRepository from '../../data/appointments/appointment.repository';
import Appointment from '../../models/appointment.model';

export default class FindAppointmentUseCase {
  private repository: AppointmentRepository;

  constructor(appointmentRepository: AppointmentRepository) {
    this.repository = appointmentRepository;
  }

  execute(): Appointment[] {
    return this.repository.all();
  }
}

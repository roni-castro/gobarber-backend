import { Repository, getRepository } from 'typeorm';

import Appointment from '../entities/appointment.entity';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { ICreateAppointmentDTO } from '@modules/appointments/dtos/AppointmentRequestDTO';

class AppointmentRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  async find() {
    return this.ormRepository.find();
  }

  async create(params: ICreateAppointmentDTO) {
    const appointment = this.ormRepository.create(params);
    await this.ormRepository.save(appointment);
    return appointment;
  }

  async findByDate(date: Date): Promise<Appointment | undefined> {
    const foundAppointmentInSameDate = await this.ormRepository.findOne({
      where: { date },
    });
    return foundAppointmentInSameDate;
  }
}

export default AppointmentRepository;

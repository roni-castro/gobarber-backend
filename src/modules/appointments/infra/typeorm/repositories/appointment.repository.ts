import { Repository, getRepository, Raw } from 'typeorm';

import Appointment from '../entities/appointment.entity';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { ICreateAppointmentDTO } from '@modules/appointments/dtos/AppointmentRequestDTO';
import IFindAppointmentInMonthDTO from '@modules/appointments/repositories/dtos/filter-appointment.dto';

class AppointmentRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  async find() {
    return this.ormRepository.find();
  }

  async findAllProviderInMonth({
    providerId,
    month,
    year,
  }: IFindAppointmentInMonthDTO) {
    const parsedMonth = String(month).padStart(2, '0');
    return this.ormRepository.find({
      where: {
        provider_id: providerId,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = ${parsedMonth}-${year}`
        ),
      },
    });
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

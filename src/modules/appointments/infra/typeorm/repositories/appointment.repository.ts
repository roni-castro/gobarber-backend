import { Repository, getRepository, Raw } from 'typeorm';

import Appointment from '../entities/appointment.entity';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { ICreateAppointmentDTO } from '@modules/appointments/dtos/AppointmentRequestDTO';
import IFindAppointmentDTO from '@modules/appointments/repositories/dtos/filter-appointment.dto';

class AppointmentRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  async find() {
    return this.ormRepository.find();
  }

  async findAllInMonthFromProvider({
    providerId,
    month,
    year,
  }: IFindAppointmentDTO) {
    const parsedMonth = String(month).padStart(2, '0');
    return this.ormRepository.find({
      where: {
        provider_id: providerId,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        ),
      },
    });
  }

  async findAllInDayFromProvider({
    providerId,
    day,
    month,
    year,
  }: IFindAppointmentDTO) {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');
    return this.ormRepository.find({
      where: {
        provider_id: providerId,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') =  '${parsedDay}-${parsedMonth}-${year}'`
        ),
      },
      order: { date: 'ASC' },
    });
  }

  async create(params: ICreateAppointmentDTO) {
    const appointment = this.ormRepository.create(params);
    await this.ormRepository.save(appointment);
    return appointment;
  }

  async findByDate(
    date: Date,
    providerId: string
  ): Promise<Appointment | undefined> {
    const foundAppointmentInSameDate = await this.ormRepository.findOne({
      where: { date, provider_id: providerId },
    });
    return foundAppointmentInSameDate;
  }
}

export default AppointmentRepository;

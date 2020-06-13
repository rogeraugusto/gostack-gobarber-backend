import { getRepository, Repository } from 'typeorm';

import IAppointmentsRespository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRespository {
  private ormReporitory: Repository<Appointment>;

  constructor() {
    this.ormReporitory = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormReporitory.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormReporitory.create({ provider_id, date });

    await this.ormReporitory.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;

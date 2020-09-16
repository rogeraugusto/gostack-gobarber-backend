import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRespository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRespository {
  private ormReporitory: Repository<Appointment>;

  constructor() {
    this.ormReporitory = getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormReporitory.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    // Usa o pad para preencher com zero o mês, em string.
    const parsedMonth = String(month).padStart(2, '0');

    // O Raw é usado para passar um texto que é interpretado dentro do postgres, no caso, uma função para comparar a data.
    const appointments = await this.ormReporitory.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
      order: { date: 'ASC' },
    });
    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    // Usa o pad para preencher com zero o mês, em string.
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    // O Raw é usado para passar um texto que é interpretado dentro do postgres, no caso, uma função para comparar a data.
    const appointments = await this.ormReporitory.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      order: { date: 'ASC' },
      relations: ['user'],
    });

    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormReporitory.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormReporitory.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;

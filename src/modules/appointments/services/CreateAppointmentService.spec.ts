import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    // Força um valor para o Date now 10/05/2020 as 12:00
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 24, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 5, 24, 13),
      provider_id: '65698',
      user_id: '12312',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('65698');
  });

  it('should not be able to create two appointment at same time', async () => {
    const appointmentDate = new Date(2020, 5, 24, 15);

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '65698',
      user_id: '12312',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '65698',
        user_id: '12312',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment at past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 24, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 5, 24, 11),
        provider_id: '65698',
        user_id: '12312',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 24, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 5, 24, 13),
        provider_id: '65698',
        user_id: '65698',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 24, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 5, 24, 7),
        provider_id: '65698',
        user_id: '65698',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 5, 24, 18),
        provider_id: '65698',
        user_id: '65698',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointmentService: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    // Força um valor para o Date now 10/05/2020 as 12:00
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 30, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 6, 30, 13),
      provider_id: '65698',
      user_id: '12312',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('65698');
  });

  it('should not be able to create two appointment at same time', async () => {
    const appointmentDate = new Date(2020, 6, 15, 14);

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
      return new Date(2020, 6, 30, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 6, 30, 11),
        provider_id: '65698',
        user_id: '12312',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 30, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 6, 30, 13),
        provider_id: '65698',
        user_id: '65698',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 30, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 6, 30, 7),
        provider_id: '65698',
        user_id: '65698',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 6, 30, 18),
        provider_id: '65698',
        user_id: '65698',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

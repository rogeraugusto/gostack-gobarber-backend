import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUsersTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Morgan Neil',
      email: 'morgan@morgan.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'morgan@morgan.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a nono-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'morgan@morgan.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUsersTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Morgan Neil',
      email: 'morgan@morgan.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'morgan@morgan.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});

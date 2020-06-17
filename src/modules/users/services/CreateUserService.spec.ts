import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUserService', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'Morgan Freeman',
      email: 'morgan@morgan.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('morgan@morgan.com');
  });

  it('should not be able to create a new user with an already registered email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      name: 'Morgan Freeman',
      email: 'morgan@morgan.com',
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'Morgan Freeman',
        email: 'morgan@morgan.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

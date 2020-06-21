import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Morgan Freeman',
      email: 'morgan@morgan.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('morgan@morgan.com');
  });

  it('should not be able to create a new user with an already registered email', async () => {
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

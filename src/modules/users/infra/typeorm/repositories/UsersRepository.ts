import { getRepository, Repository, Not } from 'typeorm';

import IUsersRespository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRespository {
  private ormReporitory: Repository<User>;

  constructor() {
    this.ormReporitory = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormReporitory.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormReporitory.findOne({ where: { email } });

    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.ormReporitory.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      users = await this.ormReporitory.find();
    }

    return users;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormReporitory.create(userData);

    await this.ormReporitory.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormReporitory.save(user);
  }
}

export default UsersRepository;

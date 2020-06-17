import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private ormReporitory: Repository<UserToken>;

  constructor() {
    this.ormReporitory = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormReporitory.findOne({ where: { token } });

    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormReporitory.create({
      user_id,
    });

    await this.ormReporitory.save(userToken);

    return userToken;
  }
}

export default UserTokensRepository;

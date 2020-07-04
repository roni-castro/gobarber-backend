import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';
import IUserRepository from '../../users/repositories/IUserRepository';
import User from '@modules/users/infra/typeorm/entities/user.entity';
import ICacheProvider from '@shared/container/providers/cacheProvider/models/i-cache-provider';


@injectable()
export default class ListAllProvidersUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  async execute(exceptUserId: string): Promise<User[]> {
    const key = `providers-list:${exceptUserId}`;
    let providers = await this.cacheProvider.recover<User[]>(key);
    if (!providers) {
      providers = await this.userRepository.findAllProviders({ exceptUserId });
      this.cacheProvider.save(key, classToClass(providers));
    }
    return providers;
  }
}

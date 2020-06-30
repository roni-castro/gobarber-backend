import FakeUserRepository from '../../users/repositories/fakes/fake-user.repository';
import ListAllProvidersUseCase from './list-all-providers.usecase';
import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/fake-cache-provider';

describe('ListAllProvidersUseCase', () => {
  let fakeUserRepository: FakeUserRepository;
  let fakeCacheProvider: FakeCacheProvider;
  let listAllProvidersUseCase: ListAllProvidersUseCase;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listAllProvidersUseCase = new ListAllProvidersUseCase(
      fakeUserRepository,
      fakeCacheProvider
    );
  });

  it('should list all providers', async () => {
    const provider1 = await fakeUserRepository.create({
      name: 'Provider 1',
      email: 'provider1@test.com',
      password: 'provider1',
    });

    const provider2 = await fakeUserRepository.create({
      name: 'Provider 2',
      email: 'provider2@test.com',
      password: 'provider2',
    });

    const user = await fakeUserRepository.create({
      name: 'user',
      email: 'user@test.com',
      password: 'user',
    });

    const providers = await listAllProvidersUseCase.execute(user.id);
    expect(providers).toEqual(expect.arrayContaining([provider1, provider2]));
  });
});

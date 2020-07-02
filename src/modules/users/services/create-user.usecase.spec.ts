import AppError from '@shared/error/AppError';
import FakeUserRepository from '../repositories/fakes/fake-user.repository';
import CreateUserUseCase from './create-user.usecase';
import FakeHashProvider from '../providers/hashProvider/fakes/fake-hash.provider';
import FakeCacheProvider from '@shared/container/providers/cacheProvider/fakes/fake-cache-provider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserUseCase: CreateUserUseCase;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUserUseCase = new CreateUserUseCase(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider
    );
  });

  it('should be able to create a new user', async () => {
    const userRequestData = {
      name: 'Teste',
      email: 'email@teste.com',
      password: '123456',
    };
    const user = await createUserUseCase.execute(userRequestData);
    expect(user).toHaveProperty('id');
    expect(user.name).toBe(userRequestData.name);
    expect(user.email).toBe(userRequestData.email);
  });

  it('should not be able to create user with existing email', async () => {
    const userRequestData = {
      name: 'Teste',
      email: 'email@teste.com',
      password: '123456',
    };
    await createUserUseCase.execute(userRequestData);
    await expect(
      createUserUseCase.execute(userRequestData)
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete redis providers-list cache when a new user is created', async () => {
    const invalidatePrefixMock = jest.spyOn(
      fakeCacheProvider,
      'invalidatePrefix'
    );
    await createUserUseCase.execute({
      name: 'Teste',
      email: 'email@teste.com',
      password: '123456',
    });
    expect(invalidatePrefixMock).toHaveBeenCalledWith('providers-list');
  });
});

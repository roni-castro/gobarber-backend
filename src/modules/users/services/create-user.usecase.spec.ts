import AppError from '@shared/error/AppError';
import FakeUserRepository from '../repositories/fakes/fake-user.repository';
import CreateUserUseCase from './create-user.usecase';
import FakeHashProvider from '../providers/hashProvider/fakes/fake-hash.provider';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserUseCase = new CreateUserUseCase(
      fakeUserRepository,
      fakeHashProvider
    );
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
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserUseCase = new CreateUserUseCase(
      fakeUserRepository,
      fakeHashProvider
    );
    const userRequestData = {
      name: 'Teste',
      email: 'email@teste.com',
      password: '123456',
    };
    await createUserUseCase.execute(userRequestData);
    expect(createUserUseCase.execute(userRequestData)).rejects.toBeInstanceOf(
      AppError
    );
  });
});

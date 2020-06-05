import AppError from '@shared/error/AppError';
import FakeUserRepository from '../repositories/fakes/fake-user.repository';
import CreateSessionUseCase from './create-session.usecase';
import CreateUserUseCase from './create-user.usecase';
import FakeHashProvider from '../providers/hashProvider/fakes/fake-hash.provider';

describe('CreateSession', () => {
  it('should be able to create a session', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSessionUseCase = new CreateSessionUseCase(
      fakeUserRepository,
      fakeHashProvider
    );
    const createUserUseCase = new CreateUserUseCase(
      fakeUserRepository,
      fakeHashProvider
    );

    const userRequestData = {
      email: 'email@teste.com',
      password: '123456',
    };
    await createUserUseCase.execute({ ...userRequestData, name: 'Teste' });

    const session = await createSessionUseCase.execute(userRequestData);
    expect(session).toHaveProperty('token');
    expect(session.user).toHaveProperty('id');
    expect(session.user.email).toBe(userRequestData.email);
  });

  it('should throw 401 error when user does not exists', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSessionUseCase = new CreateSessionUseCase(
      fakeUserRepository,
      fakeHashProvider
    );
    const userRequestData = {
      email: 'email@teste.com',
      password: '123456',
    };
    expect(
      createSessionUseCase.execute(userRequestData)
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw 401 error when password does not match', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createSessionUseCase = new CreateSessionUseCase(
      fakeUserRepository,
      fakeHashProvider
    );
    const createUserUseCase = new CreateUserUseCase(
      fakeUserRepository,
      fakeHashProvider
    );

    const userRequestData = {
      email: 'email@teste.com',
      password: '123456',
    };
    await createUserUseCase.execute({ ...userRequestData, name: 'Teste' });
    expect(
      createSessionUseCase.execute({
        ...userRequestData,
        password: 'wrong pass',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

import FakeUserRepository from '../repositories/fakes/fake-user.repository';
import FindUserUseCase from './find-user.usecase';
import AppError from '@shared/error/AppError';

describe('FindUserProfileUseCase', () => {
  let userRepository: FakeUserRepository;
  let findUserUseCase: FindUserUseCase;
  const userData = {
    name: 'Test',
    email: 'email@test.com',
    password: '123456',
  };

  beforeEach(() => {
    userRepository = new FakeUserRepository();
    findUserUseCase = new FindUserUseCase(userRepository);
  });

  it('should show user profile successfully', async () => {
    const user = await userRepository.create(userData);
    const userFound = await findUserUseCase.execute({ id: user.id });
    expect(userFound.email).toBe(user.email);
    expect(userFound.id).toBe(user.id);
  });

  it('should throw error if user is not found', async () => {
    expect(
      findUserUseCase.execute({ id: 'invalid user id' })
    ).rejects.toBeInstanceOf(AppError);
  });
});

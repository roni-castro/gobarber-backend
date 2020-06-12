import AppError from '@shared/error/AppError';
import FakeUserRepository from '../repositories/fakes/fake-user.repository';
import FakeUserTokenRepository from '../repositories/fakes/fake-user-token.repository';
import ResetPasswordUseCase from './reset-password.usecase';
import FakeHashProvider from '../providers/hashProvider/fakes/fake-hash.provider';

describe('ResetPassword', () => {
  let fakeUserRepository: FakeUserRepository;
  let fakeHashProvider: FakeHashProvider;
  let fakeUserTokenRepository: FakeUserTokenRepository;
  let resetPasswordUseCase: ResetPasswordUseCase;
  const userData = {
    name: 'Test',
    email: 'email@test.com',
    password: '123456',
  };

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordUseCase = new ResetPasswordUseCase(
      fakeUserRepository,
      fakeUserTokenRepository,
      fakeHashProvider
    );
  });

  it('should be reset password', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    const user = await fakeUserRepository.create(userData);
    const userToken = await fakeUserTokenRepository.generate(user.id);
    const newPassword = '111222';
    const userUpdated = await resetPasswordUseCase.execute({
      token: userToken.token,
      password: newPassword,
      confirmPassword: newPassword,
    });
    expect(generateHash).toHaveBeenCalledWith(newPassword);
    expect(userUpdated.password).toBe(newPassword);
  });

  it('should not be able to reset password when token has expired the limit of 2h', async () => {
    const user = await fakeUserRepository.create(userData);
    const userToken = await fakeUserTokenRepository.generate(user.id);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const date = new Date();
      date.setHours(date.getHours() + 3);
      return date.getTime();
    });
    await expect(
      resetPasswordUseCase.execute({
        token: userToken.token,
        password: '111222',
        confirmPassword: '111222',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password when token does not exists', async () => {
    await expect(
      resetPasswordUseCase.execute({
        token: 'non existing token',
        password: '123456',
        confirmPassword: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password when user does not exists', async () => {
    const userToken = await fakeUserTokenRepository.generate(
      'non existing user id'
    );
    await expect(
      resetPasswordUseCase.execute({
        token: userToken.token,
        password: '123456',
        confirmPassword: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to reset password if new passwords does not match', async () => {
    const user = await fakeUserRepository.create(userData);
    const userToken = await fakeUserTokenRepository.generate(user.id);
    await expect(
      resetPasswordUseCase.execute({
        token: userToken.token,
        password: '111222',
        confirmPassword: 'different password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

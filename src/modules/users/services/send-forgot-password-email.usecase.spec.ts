import AppError from '@shared/error/AppError';
import FakeUserRepository from '../repositories/fakes/fake-user.repository';
import SendForgotPasswordEmailUseCase from './send-forgot-password-email.usecase';
import FakeEmailProvider from '@shared/container/providers/emailProvider/fakes/fake-email.provider';
import FakeUserTokenRepository from '../repositories/fakes/fake-user-token.repository';

describe('SendForgotPasswordEmail', () => {
  let fakeUserRepository: FakeUserRepository;
  let fakeEmailProvider: FakeEmailProvider;
  let fakeUserTokenRepository: FakeUserTokenRepository;
  let sendForgotPasswordEmailUseCase: SendForgotPasswordEmailUseCase;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeEmailProvider = new FakeEmailProvider();
    sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(
      fakeUserRepository,
      fakeUserTokenRepository,
      fakeEmailProvider
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendEmail = jest.spyOn(fakeEmailProvider, 'sendEmail');
    const userData = {
      name: 'Test',
      email: 'email@test.com',
      password: '123456',
    };
    const { email } = await fakeUserRepository.create(userData);
    await sendForgotPasswordEmailUseCase.execute({ email });
    expect(sendEmail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmailUseCase.execute({ email: 'email@test.com' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to generate a forgot password recovery token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');
    const userData = {
      name: 'Test',
      email: 'email@test.com',
      password: '123456',
    };
    const user = await fakeUserRepository.create(userData);
    await sendForgotPasswordEmailUseCase.execute({
      email: 'email@test.com',
    });
    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});

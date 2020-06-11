import AppError from '@shared/error/AppError';
import FakeUserRepository from '../repositories/fakes/fake-user.repository';
import FakeHashProvider from '../providers/hashProvider/fakes/fake-hash.provider';
import SendForgotPasswordEmailUseCase from './send-forgot-password-email.usecase';
import FakeEmailProvider from '@shared/container/providers/emailProvider/fakes/fake-email.provider';

describe('SendForgotPasswordEmail', () => {
  let fakeUserRepository: FakeUserRepository;
  let fakeEmailProvider: FakeEmailProvider;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeEmailProvider = new FakeEmailProvider();
  });

  it('should be able to recover the password using the email', async () => {
    const sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(
      fakeUserRepository,
      fakeEmailProvider
    );
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
    const sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(
      fakeUserRepository,
      fakeEmailProvider
    );
    const sendEmail = jest.spyOn(fakeEmailProvider, 'sendEmail');
    await expect(
      sendForgotPasswordEmailUseCase.execute({ email: 'email@test.com' })
    ).rejects.toBeInstanceOf(AppError);
  });
});

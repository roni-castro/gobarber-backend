import FakeUserRepository from '../repositories/fakes/fake-user.repository';
import UpdateUserProfileUseCase from './update-user-profile.usecase';
import AppError from '@shared/error/AppError';
import FakeHashProvider from '../providers/hashProvider/fakes/fake-hash.provider';

describe('UpdateUserProfileUseCase', () => {
  let userRepository: FakeUserRepository;
  let updateUserProfileUseCase: UpdateUserProfileUseCase;
  let hashProvider: FakeHashProvider;
  const userData = {
    name: 'Test',
    email: 'email@test.com',
    password: '123456',
  };

  beforeEach(() => {
    userRepository = new FakeUserRepository();
    hashProvider = new FakeHashProvider();
    updateUserProfileUseCase = new UpdateUserProfileUseCase(
      userRepository,
      hashProvider
    );
  });

  it('should update user profile successfully', async () => {
    const user = await userRepository.create(userData);
    const userNewData = {
      id: user.id,
      name: 'New Name',
      email: 'newemail@email.com',
      oldPassword: userData.password,
      password: 'new password',
      passwordConfirmation: 'new password',
    };
    const userUpdated = await updateUserProfileUseCase.execute(userNewData);
    expect(userUpdated).toMatchObject({
      id: userNewData.id,
      email: userNewData.email,
      name: userNewData.name,
      password: userNewData.password,
    });
  });

  it('should update the user email to the same one if specified', async () => {
    const user = await userRepository.create(userData);
    const userNewData = {
      id: user.id,
      email: user.email,
      oldPassword: user.password,
      name: 'New Name',
      password: 'new password',
      passwordConfirmation: 'new password',
    };
    const userUpdated = await updateUserProfileUseCase.execute(userNewData);
    expect(userUpdated).toMatchObject({
      id: userNewData.id,
      email: userNewData.email,
      name: userNewData.name,
      password: userNewData.password,
    });
  });

  it('should maintain the user default info if no data is passed', async () => {
    const user = await userRepository.create(userData);
    const userNewData = {
      id: user.id,
    };
    const userUpdated = await updateUserProfileUseCase.execute(userNewData);
    expect(userUpdated).toMatchObject({
      id: userNewData.id,
      email: user.email,
      name: user.name,
      password: user.password,
    });
  });

  it('should not update user profile if it does not exists', async () => {
    const userNewData = {
      id: 'non-existing user id',
      ...userData,
    };
    await expect(
      updateUserProfileUseCase.execute(userNewData)
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not update user profile if the new email is already used', async () => {
    const userWithExistingEmail = await userRepository.create(userData);
    const userToBeUpdated = await userRepository.create({
      ...userData,
      email: 'userToBeUpdated@email.com',
    });
    await expect(
      updateUserProfileUseCase.execute({
        ...userToBeUpdated,
        email: userWithExistingEmail.email,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not update user data if current password is invalid', async () => {
    const userToBeUpdated = await userRepository.create(userData);
    await expect(
      updateUserProfileUseCase.execute({
        ...userToBeUpdated,
        oldPassword: 'invalid old password',
        password: 'new password',
        passwordConfirmation: 'new password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not update user data if password confirmation and password do not match', async () => {
    const userToBeUpdated = await userRepository.create(userData);
    await expect(
      updateUserProfileUseCase.execute({
        ...userToBeUpdated,
        oldPassword: userData.password,
        password: 'new password',
        passwordConfirmation: undefined,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not update user data if old password is not passed', async () => {
    const userToBeUpdated = await userRepository.create(userData);
    await expect(
      updateUserProfileUseCase.execute({
        ...userToBeUpdated,
        password: 'new password',
        passwordConfirmation: 'new password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

import FakeUserRepository from '../repositories/fakes/fake-user.repository';
import UpdateUserAvatarUseCase from './update-user-avatar.usecase';
import FakeDiskStorageProvider from '@shared/container/providers/storageProvider/fakes/fake-disk-storage.provider';
import AppError from '@shared/error/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeDiskStorageProvider: FakeDiskStorageProvider;
let uploadUserAvatarUseCase: UpdateUserAvatarUseCase;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeDiskStorageProvider = new FakeDiskStorageProvider();
    uploadUserAvatarUseCase = new UpdateUserAvatarUseCase(
      fakeUserRepository,
      fakeDiskStorageProvider
    );
  });

  it('should be able to update a user avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'Teste',
      email: 'email@teste.com',
      password: '123456',
    });

    const updateUserAvatarData = {
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    };
    const updatedUser = await uploadUserAvatarUseCase.execute(
      updateUserAvatarData
    );
    expect(updatedUser.id).toBe(updateUserAvatarData.user_id);
    expect(updatedUser.avatar).toBe(updateUserAvatarData.avatarFilename);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFileMock = jest.spyOn(fakeDiskStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'Teste',
      email: 'email@teste.com',
      password: '123456',
    });
    const updateUserAvatarData = {
      user_id: user.id,
      avatarFilename: 'avatar1.jpg',
    };
    await uploadUserAvatarUseCase.execute(updateUserAvatarData);

    const newUserAvatarData = {
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    };
    const updatedUser = await uploadUserAvatarUseCase.execute(
      newUserAvatarData
    );

    expect(updatedUser.id).toBe(newUserAvatarData.user_id);
    expect(updatedUser.avatar).toBe(newUserAvatarData.avatarFilename);
    expect(deleteFileMock).toHaveBeenCalledWith(
      updateUserAvatarData.avatarFilename
    );
  });

  it('should not be able to update avatar when user does not exists', async () => {
    const updateUserAvatarData = {
      user_id: 'invalid user id',
      avatarFilename: 'avatar.jpg',
    };

    expect(
      uploadUserAvatarUseCase.execute(updateUserAvatarData)
    ).rejects.toEqual(
      new AppError('Only authenticated users can change avatar', 401)
    );
  });
});

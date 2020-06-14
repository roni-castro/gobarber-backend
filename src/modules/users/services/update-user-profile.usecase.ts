import IUserRepository from '../repositories/IUserRepository';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IHashProvider from '../providers/hashProvider/models/IHashProvider';

interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  oldPassword?: string;
  password?: string;
  passwordConfirmation?: string;
}

@injectable()
export default class UpdateUserProfileUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    id,
    name,
    email,
    oldPassword,
    password,
    passwordConfirmation,
  }: UpdateUserRequest) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found');
    }

    if (await this.hasUserWithExistingEmail(user.email, email)) {
      throw new AppError('User with this email already exists');
    }

    if (this.hasInvalidConfirmationPassword(password, passwordConfirmation)) {
      throw new AppError('Password and confirmation password do not match');
    }

    if (
      password &&
      (await this.hasInvalidOldPassword(user.password, oldPassword))
    ) {
      throw new AppError('Old password does not match');
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      const hashedPassword = await this.hashProvider.generateHash(password);
      user.password = hashedPassword;
    }
    await this.userRepository.save(user);
    return user;
  }

  private async hasInvalidOldPassword(
    currentPassword: string,
    password?: string
  ) {
    if (!password) {
      return true;
    }
    const hasValidPassword = await this.hashProvider.compareHash(
      password,
      currentPassword
    );
    return !hasValidPassword;
  }

  private hasInvalidConfirmationPassword(
    password?: string,
    passwordConfirmation?: string
  ) {
    return password && password !== passwordConfirmation;
  }

  private async hasUserWithExistingEmail(userEmail: string, newEmail?: string) {
    if (newEmail && userEmail !== newEmail) {
      const userWithExistingEmail = await this.userRepository.findByEmail(
        newEmail
      );
      return !!userWithExistingEmail;
    }
    return false;
  }
}

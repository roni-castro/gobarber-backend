import { Router } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';
import CreateUserUseCase from '@modules/users/services/create-user.usecase';
import FindUsersUseCase from '@modules/users/services/find-users.usecase';
import checkTokenMiddleware from '@modules/users/infra/middlewares/check-token.middleware';
import uploadConfig from '../upload/upload-config';
import UpdateUserAvatarUseCase from '@modules/users/services/update-user-avatar.usecase';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.get('/', async (request, response) => {
  const useCase = container.resolve(FindUsersUseCase);
  let users = await useCase.execute();
  users = users.map(user => {
    // eslint-disable-next-line no-param-reassign
    delete user.password;
    return user;
  });
  return response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const useCase = container.resolve(CreateUserUseCase);
  const { name, email, password } = request.body;
  const user = await useCase.execute({ name, email, password });
  delete user.password;
  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  checkTokenMiddleware,
  upload.single('avatar'),
  async (request, response) => {
    const useCase = container.resolve(UpdateUserAvatarUseCase);
    const user = await useCase.execute({
      avatarFilename: request.file.filename,
      user_id: request.user.id,
    });
    delete user.password;
    return response.json(user);
  }
);

export default usersRouter;

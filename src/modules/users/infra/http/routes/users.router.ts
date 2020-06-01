import { Router } from 'express';
import multer from 'multer';
import checkTokenMiddleware from '@modules/users/infra/http/middlewares/check-token.middleware';
import uploadConfig from '@shared/infra/http/routes/upload/upload-config';
import UserController from '../controllers/user.controller';
import UserAvatarController from '../controllers/user-avatar.controller';

const usersRouter = Router();
const upload = multer(uploadConfig);
const userController = new UserController();
const userAvatarController = new UserAvatarController();

usersRouter.get('/', checkTokenMiddleware, userController.show);

usersRouter.post('/', userController.create);

usersRouter.patch(
  '/avatar',
  checkTokenMiddleware,
  upload.single('avatar'),
  userAvatarController.update
);

export default usersRouter;

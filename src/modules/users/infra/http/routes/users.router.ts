import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';
import checkTokenMiddleware from '@modules/users/infra/http/middlewares/check-token.middleware';
import uploadConfig from '@shared/infra/http/routes/upload/upload-config';
import UserController from '../controllers/user.controller';
import UserAvatarController from '../controllers/user-avatar.controller';
import UserProfileController from '../controllers/user-profile.controller';

const usersRouter = Router();
const upload = multer(uploadConfig);
const userController = new UserController();
const userAvatarController = new UserAvatarController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  userController.create
);
usersRouter.get('/', checkTokenMiddleware, userController.show);
usersRouter.patch(
  '/avatar',
  checkTokenMiddleware,
  upload.single('avatar'),
  userAvatarController.update
);

export default usersRouter;

import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import checkTokenMiddleware from '@modules/users/infra/http/middlewares/check-token.middleware';
import UserProfileController from '../controllers/user-profile.controller';

const userProfileRouter = Router();
const userProfileController = new UserProfileController();
userProfileRouter.use(checkTokenMiddleware);

userProfileRouter.get('/', userProfileController.show);
userProfileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      oldPassword: Joi.string(),
      password: Joi.string(),
      passwordConfirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  userProfileController.update
);

export default userProfileRouter;

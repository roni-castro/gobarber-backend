import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ForgotPasswordController from '../controllers/forgot-password.controller';
import ResetPasswordController from '../controllers/reset-password.controller';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create
);
passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetPasswordController.create
);

export default passwordRouter;

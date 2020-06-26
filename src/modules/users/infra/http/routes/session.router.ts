import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import SessionController from '../controllers/session.controller';

const sessionRouter = Router();
const sessionController = new SessionController();

sessionRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionController.create
);

export default sessionRouter;

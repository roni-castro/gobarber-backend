import express, { Router } from 'express';
import appointmentsRouter from './appointments/appointments.router';
import usersRouter from './users/users.router';
import sessionRouter from './session/session.router';
import checkTokenMiddleware from './middlewares/check-token.middleware';
import uploadConfig from './upload/upload-config';

const routes = Router();

routes.use('/sessions', sessionRouter);
routes.use('/users', usersRouter);
routes.use('/files', express.static(uploadConfig.directory));

routes.use(checkTokenMiddleware);
routes.use('/appointments', appointmentsRouter);

export default routes;

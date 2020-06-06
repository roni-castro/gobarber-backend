import express, { Router } from 'express';
import 'express-async-errors';

import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.router';
import usersRouter from '@modules/users/infra/http/routes/users.router';
import sessionRouter from '@modules/users/infra/http/routes/session.router';
import checkTokenMiddleware from '@modules/users/infra/http/middlewares/check-token.middleware';
import globalErrorMiddleware from '@shared/infra/http/middlewares/global-error.middleware';
import uploadConfig from './upload/upload-config';

const routes = Router();

routes.use('/sessions', sessionRouter);
routes.use('/users', usersRouter);
routes.use('/files', express.static(uploadConfig.tmpFolder));

routes.use(checkTokenMiddleware);
routes.use('/appointments', appointmentsRouter);

routes.use(globalErrorMiddleware);

export default routes;

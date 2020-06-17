import express, { Router } from 'express';
import 'express-async-errors';

import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.router';
import providerRouter from '@modules/appointments/infra/http/routes/provider.router';
import usersRouter from '@modules/users/infra/http/routes/users.router';
import userProfileRouter from '@modules/users/infra/http/routes/user-profile.router';
import sessionRouter from '@modules/users/infra/http/routes/session.router';
import checkTokenMiddleware from '@modules/users/infra/http/middlewares/check-token.middleware';
import globalErrorMiddleware from '@shared/infra/http/middlewares/global-error.middleware';
import uploadConfig from './upload/upload-config';
import passwordRouter from '@modules/users/infra/http/routes/password.router';

const routes = Router();

routes.use('/sessions', sessionRouter);
routes.use('/users', usersRouter);
routes.use('/user', userProfileRouter);
routes.use('/password', passwordRouter);
routes.use('/files', express.static(uploadConfig.uploadsFolder));

routes.use(checkTokenMiddleware);
routes.use('/providers', providerRouter);
routes.use('/appointments', appointmentsRouter);

routes.use(globalErrorMiddleware);

export default routes;

import { Router } from 'express';
import appointmentsRouter from './appointments.router';
import usersRouter from '../users/users.router';
import sessionRouter from '../sessions/session.router';
import checkTokenMiddleware from '../middlewares/check-token.middleware';

const routes = Router();

routes.use('/sessions', sessionRouter);

routes.use(checkTokenMiddleware);

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);

export default routes;

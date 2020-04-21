import { Router } from 'express';
import appointmentsRouter from './appointments.router';
import usersRouter from '../users/users.router';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);

export default routes;

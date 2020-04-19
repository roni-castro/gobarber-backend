import { Router } from 'express';
import appointmentsRouter from './appointments.router';

const routes = Router();

routes.use('/appointments', appointmentsRouter);

export default routes;

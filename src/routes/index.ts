import { Router } from 'express';
import appointmentsRouter from './appointments.rounter';

const routes = Router();

routes.use('/appointments', appointmentsRouter);

export default routes;

import { Router } from 'express';
import AppointmentController from '../controllers/appointment.controller';

const appointmentsRouter = Router();
const appointmentController = new AppointmentController();

appointmentsRouter.get('/', appointmentController.show);

appointmentsRouter.post('/', appointmentController.create);

export default appointmentsRouter;

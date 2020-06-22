import { Router } from 'express';
import AppointmentController from '../controllers/appointment.controller';
import ProviderAppointmentsController from '../controllers/provider-appointments.controller';

const appointmentsRouter = Router();
const appointmentController = new AppointmentController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.get('/', appointmentController.show);
appointmentsRouter.post('/', appointmentController.create);
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
